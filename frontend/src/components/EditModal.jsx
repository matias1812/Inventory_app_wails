import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './InventoryTable.css';

function EditModal({ isOpen, onRequestClose, editingItem, setUpdatedData, updatedData, API_URL, setError, setData, error}) {

  useEffect(() => {
    if (editingItem) {
      const formatFecha = (fecha) => {
        const dateObj = new Date(fecha);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const fechaInicio = editingItem.contrato?.fecha_inicio
        ? formatFecha(editingItem.contrato.fecha_inicio)
        : '';
      const fechaFin = editingItem.contrato?.fecha_fin
        ? formatFecha(editingItem.contrato.fecha_fin)
        : '';

      setUpdatedData({
        nombre: editingItem.producto?.nombre || '',
        descripcion: editingItem.producto?.descripcion || '',
        ubicacion: editingItem.producto?.ubicacion || '',
        status: editingItem.producto?.status || '',
        contrato: {
          numero_contrato: editingItem.contrato?.numero_contrato || '',
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        },
      });
    }
  }, [editingItem, setUpdatedData]);

  const handleSave = async () => {
    try {
      // Actualiza el producto
      const productoResponse = await fetch(`${API_URL}/productos/${editingItem.producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: updatedData.nombre,
          descripcion: updatedData.descripcion,
          ubicacion: updatedData.ubicacion,
          status: updatedData.status,
        }),
      });
  
      if (!productoResponse.ok) {
        throw new Error('Error al actualizar el producto.');
      }
  
      // Actualiza el contrato
      const contratoResponse = await fetch(`${API_URL}/contratos/${editingItem.contrato.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero_contrato: updatedData.contrato.numero_contrato,
          fecha_inicio: updatedData.contrato.fecha_inicio,
          fecha_fin: updatedData.contrato.fecha_fin,
        }),
      });
  
      if (!contratoResponse.ok) {
        throw new Error('Error al actualizar el contrato.');
      }
  
      // Actualiza la tabla con los nuevos datos
      const updatedProducto = await productoResponse.json();
      const updatedContrato = await contratoResponse.json();
  
      // Actualiza los datos en el componente padre
      setData((prevData) =>
        prevData.map((item) =>
          item.producto.id === updatedProducto.id
            ? { ...item, producto: updatedProducto, contrato: updatedContrato }
            : item
        )
      );
  
      // Cierra el modal
      onRequestClose();
    } catch (error) {
      setError(error.message);
    }
  };
  
  const closeModals = () => {
    onRequestClose();
  };

  if (!editingItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar Producto y Contrato"
      className="modal-contrato"
      overlayClassName="modal-overlay-contrato"
    >
      <h2>Editar Producto y Contrato</h2>
      <form>
        <label>
          Nombre:
          <input
            type="text"
            value={updatedData.nombre}
            onChange={(e) => setUpdatedData({ ...updatedData, nombre: e.target.value })}
          />
        </label>
        <label>
          Descripción:
          <input
            type="text"
            value={updatedData.descripcion}
            onChange={(e) => setUpdatedData({ ...updatedData, descripcion: e.target.value })}
          />
        </label>
        <label>
          Ubicación:
          <input
            type="text"
            value={updatedData.ubicacion}
            onChange={(e) => setUpdatedData({ ...updatedData, ubicacion: e.target.value })}
          />
        </label>
        <label>
          Status:
          <input
            type="text"
            value={updatedData.status}
            onChange={(e) => setUpdatedData({ ...updatedData, status: e.target.value })}
          />
        </label>
        <label>
          Número de Contrato:
          <input
            type="text"
            value={updatedData.contrato?.numero_contrato || ''}
            onChange={(e) => setUpdatedData({
              ...updatedData,
              contrato: {
                ...updatedData.contrato,
                numero_contrato: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Fecha Inicio:
          <input
            type="date"
            value={updatedData.contrato?.fecha_inicio || ''}
            onChange={(e) => setUpdatedData({
              ...updatedData,
              contrato: {
                ...updatedData.contrato,
                fecha_inicio: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Fecha Fin:
          <input
            type="date"
            value={updatedData.contrato?.fecha_fin || ''}
            onChange={(e) => setUpdatedData({
              ...updatedData,
              contrato: {
                ...updatedData.contrato,
                fecha_fin: e.target.value,
              },
            })}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-buttons">
          <button type="button" onClick={handleSave}>
            Guardar
          </button>
          <button type="button" onClick={closeModals}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditModal;
