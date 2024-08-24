import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import FileViewerModal from './FileViewerModal'; // Importa el componente del modal
import '../pages/usuariosAdmin.css';  
import { useApi } from '../utils/useApi'; // Ajusta la ruta según tu estructura de carpetas

Modal.setAppElement('#root'); // Asegúrate de que el modal se monte en el elemento raíz

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SOME_KEY;

  const [movimientosData, loadingMovimientos, errorMovimientos] = useApi('movimientos', 'GET');
  console.log(movimientosData, 'movimientos');
  
  useEffect(() => {
    if (movimientosData) {
      setMovimientos(movimientosData);
      setLoading(false);
    }
  }, [movimientosData]);

  const handleDownloadReport = async () => {
    const reportEndpoint = `${API_URL}/reportes/movimientos`;
  
    try {
      setLoading(true);
  
      // Hacer la solicitud para generar el archivo PDF y obtener la ruta
      const response = await fetch(reportEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const fileData = await response.json();
      const filePath = fileData.file_path;
  
      if (!filePath) {
        throw new Error('No se proporcionó la ruta del archivo.');
      }
  
      // Construir la URL para descargar el archivo
      const fileDownloadUrl = `${API_URL}/${filePath}`;
  
      // Hacer la solicitud para descargar el archivo
      const fileResponse = await fetch(fileDownloadUrl);
      if (!fileResponse.ok) {
        throw new Error(`HTTP error! Status: ${fileResponse.status}`);
      }
  
      const fileBlob = await fileResponse.blob();
      const fileUrl = URL.createObjectURL(fileBlob);
  
      // Mostrar el archivo en el modal
      setFileUrl(fileUrl);
      setFileType('application/pdf');
      setModalIsOpen(true);
  
      console.log('File successfully retrieved:', fileDownloadUrl);
    } catch (error) {
      console.error('Error fetching file:', error);
      setError(error.message); // Muestra el error en la UI si es necesario
    } finally {
      setLoading(false);
    }
  };
         
  const handleCloseModal = () => {
    setFileUrl('');
    setModalIsOpen(false);
  };

  if (loadingMovimientos) {
    return <div>Loading...</div>;
  }

  if (errorMovimientos) {
    return <div>Error: {errorMovimientos}</div>;
  }

  const handleNavigateToInventory = () => {
    navigate('/inventory');
  };

  return (
    <div className="admin-container">
      <button type='button' onClick={handleNavigateToInventory} className="back-button">Volver al Inventario</button>
      <h1>Movimientos</h1>
      <div className='table-wrapper'>
        <table className="movimientos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Producto</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(movimiento => (
              <tr key={movimiento.id}>
                <td>{movimiento.id}</td>
                <td>{new Date(movimiento.fecha).toLocaleString()}</td>
                <td>{movimiento.tipo}</td>
                <td>{movimiento.cantidad}</td>
                <td>{movimiento.usuario || 'Desconocido'}</td>
                <td>{movimiento.producto || 'Desconocido'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-informe" onClick={handleDownloadReport}>
        Descargar Informe
      </button>

      <FileViewerModal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        fileUrl={fileUrl}
        fileType={fileType}
      />
    </div>
  );
}
