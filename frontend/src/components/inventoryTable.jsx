import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import EditModal from './EditModal';
import UpdateStockModal from './UpdateStockModal';
import FileViewerModal from './FileViewerModal';
import { useAuth } from '../utils/sessionContext';
import './InventoryTable.css';
import { useApi } from '../utils/useApi';

const InventoryTable = ({ searchQuery, filterLocation, isStockFilterActive, }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [fileViewerIsOpen, setFileViewerIsOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const { rol, usuario_id } = useAuth();
  const API_URL = import.meta.env.VITE_SOME_KEY;

  const [result, loadingResult, errorResult] = useApi('inventarios', 'GET');


  useEffect(() => {
    if (result) {
      const fetchAdditionalData = async () => {
        try {
          const productoRequests = result.map(item =>
            fetch(`${API_URL}/productos/${item.producto_id}`).then(res => res.json())
          );

          const contratoRequests = result.map(item =>
            fetch(`${API_URL}/contratos/${item.contrato_id}`).then(res => res.json())
          );

          const productoResponses = await Promise.all(productoRequests);
          const contratoResponses = await Promise.all(contratoRequests);

          const combinedData = result.map(item => ({
            ...item,
            producto: productoResponses.find(p => p.id === item.producto_id) || {},
            contrato: contratoResponses.find(c => c.id === item.contrato_id) || {},
          }));

          combinedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setData(combinedData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAdditionalData();
    }
  }, [result]);

  useEffect(() => {
    let filtered = data;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        (item.producto?.nombre?.toLowerCase().includes(lowerQuery) || '') ||
        (item.contrato?.nombre?.toLowerCase().includes(lowerQuery) || '') ||
        (item.contrato?.numero_contrato?.toLowerCase().includes(lowerQuery) || '') // Filtro por identificador del contrato
      );
    }
  
    if (filterLocation) {
      // Limpiar y formatear la ubicación antes de filtrar
      const cleanedFilterLocation = filterLocation.replace(/^bodega-/, 'Bodega ');
      filtered = filtered.filter(item => {
        const cleanedUbicacion = item.producto.ubicacion.replace(/^bodega-/, 'Bodega ');
        return cleanedUbicacion === cleanedFilterLocation;
      });
    }
  
    if (isStockFilterActive) {
      filtered = filtered.filter(item => item.stock_actual === 0); // Filtra los productos con stock actual igual a 0
    } else {
      filtered = filtered.filter(item => item.stock_actual > 0); // Muestra productos con stock actual mayor a 0 cuando el filtro no está activo
    }
  
    setFilteredData(filtered);
  }, [data, searchQuery, filterLocation, isStockFilterActive]);
    
  const openModal = async (filePath) => {
    const startIndex = filePath.indexOf('uploads/');
    const relativeFilePath = filePath.substring(startIndex);
    const fullUrl = `${API_URL}/contratos/${relativeFilePath}`;
  
    try {
      // Hacer la petición GET
      const response = await fetch(fullUrl);
  
      // Verificar si la petición fue exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Detectar el tipo de archivo desde la cabecera de respuesta
      const fileType = response.headers.get('Content-Type');
  
      // Convertir la respuesta en blob
      const fileBlob = await response.blob();
  
      // Crear una URL para el blob
      const fileUrl = URL.createObjectURL(fileBlob);
  
      // Actualizar el estado con la URL del archivo y el tipo
      setFileUrl(fileUrl);
      setFileType(fileType);
      setFileViewerIsOpen(true);
  
      console.log('File successfully retrieved:', fullUrl);
    } catch (error) {
      console.error('Error fetching file:', error);
      // Manejar el error según sea necesario
    }
  };
      
  const closeModals = () => {
    setEditModalIsOpen(false);
    setUpdateModalIsOpen(false);
    setFileViewerIsOpen(false);
    setEditingItem(null);
    setUpdatedData({});
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/inventarios/${id}`, { method: 'DELETE' });
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading || loadingResult) return <div>Cargando...</div>;
  if (error || errorResult) return <div>Error: {error || errorResult.message}</div>;

  return (
    <>
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Unidad de Medida</th>
              <th>Status</th>
              <th>Ubicación</th>
              <th>Stock Inicial</th>
              <th>Stock Actual</th>
              <th>Identificador del contrato</th>
              <th>Contrato</th>
              <th>Inicio del Contrato</th>
              <th>Fin del Contrato</th>
              {rol === 'admin' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.producto?.nombre}</td>
                <td>{item.producto?.descripcion}</td>
                <td>{item.producto?.unidad_medida}</td>
                <td>{item.producto?.status}</td>
                <td>{item.producto?.ubicacion}</td>
                <td>{item.stock_inicial}</td>
                <td>{item.stock_actual}</td>
                <td>{item.contrato?.numero_contrato}</td>
                <td>
                  <button type='button' onClick={() => openModal(item.contrato?.archivo_path)}>
                    Ver Contrato
                  </button>
                </td>
                <td>{new Date(item.contrato?.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(item.contrato?.fecha_fin).toLocaleDateString()}</td>
                {rol === 'admin' && (
                  <td>
                    <button type='button' onClick={() => handleEdit(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button type='button' onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button type='button' onClick={() => {
                      setEditingItem(item);
                      setUpdateModalIsOpen(true);
                    }}>
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditModal
        isOpen={editModalIsOpen}
        onRequestClose={closeModals}
        editingItem={editingItem}
        updatedData={updatedData}
        setUpdatedData={setUpdatedData}  
        setData={setData}
        setError={setError}
        error={error}
        API_URL={API_URL}
      />
      <UpdateStockModal
        editingItem={editingItem}
        isOpen={updateModalIsOpen}
        onRequestClose={closeModals}
        API_URL={API_URL}
        setError={setError}
        setData={setData}
      /> 
      <FileViewerModal
        isOpen={fileViewerIsOpen}
        onRequestClose={closeModals}
        fileUrl={fileUrl}
        fileType={fileType}
      />    </>
  );
}

export default InventoryTable;
