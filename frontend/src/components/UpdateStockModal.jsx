import { useAuth } from '../utils/sessionContext';
import React, {useState} from 'react';
import Modal from 'react-modal';
import './InventoryTable.css';

function UpdateStockModal({ isOpen, onRequestClose, API_URL, setError, editingItem, setData }) {
  const [updateType, setUpdateType] = useState('');
  const [updateAmount, setUpdateAmount] = useState('');
  const { usuario_id } = useAuth();

  const closeModals = () => {
    onRequestClose();
  };

  const handleUpdateInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/inventarios/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventario_id: editingItem.id,
          tipo: updateType,
          cantidad: updateAmount,
          usuario_id: usuario_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el inventario.');
      }

      const updatedItem = await response.json();
      setData((prevData) =>
        prevData.map((item) =>
          item.id === updatedItem.id ? { ...item, stock_actual: updatedItem.stock_actual } : item
        )
      );

      closeModals(); // Call the locally defined closeModals function
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Stock"
      className="modal-contrato"
      overlayClassName="modal-overlay-contrato"
    >
      <h2>Actualizar Stock</h2>
      <form>
        <label>
          Tipo de Actualización:
          <select onChange={(e) => setUpdateType(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </label>
        <label>
          Cantidad:
          <input type="catidad" onChange={(e) => setUpdateAmount(e.target.value)} />
        </label>
        <button type="button" onClick={handleUpdateInventory}>
          Actualizar
        </button>
        <button type="button" onClick={closeModals}>
          Cerrar
        </button>
      </form>
    </Modal>
  );
}

export default UpdateStockModal;