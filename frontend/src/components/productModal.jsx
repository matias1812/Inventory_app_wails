import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProductModal.css';
import ProductForm from './productForm';

export default function ProductModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([{ id: uuidv4(), nombre: '', descripcion: '', unidad_medida: '', status: '', stock_inicial: '', ubicacion: '' }]);
  const [file, setFile] = useState(null);
  const [contractInfo, setContractInfo] = useState({ identificador: '', fechaInicio: '', fechaTermino: '' });

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { id: uuidv4(), nombre: '', descripcion: '', unidad_medida: '', status: '', stock_inicial: '', ubicacion: '' }]);
  };

  const handleContractChange = (e) => {
    const { name, value } = e.target;
    setContractInfo({ ...contractInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productosConUUIDs = products.map(product => ({
      ...product,
      id: product.id || uuidv4()
    }));

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('numero_contrato', contractInfo.identificador);
    formData.append('fecha_inicio', contractInfo.fechaInicio);
    formData.append('fecha_fin', contractInfo.fechaTermino);
    formData.append('productos', JSON.stringify(productosConUUIDs));

    try {
      const response = await fetch('https://vltdnxfz-5000.brs.devtunnels.ms/api/contratos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Contrato y productos registrados exitosamente');
        onClose();
      } else {
        alert('Error al registrar el contrato');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en la solicitud');
    }
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <div className="modal-content">
        <button 
          type="button" 
          className="modal-close" 
          onClick={onClose} 
          onKeyDown={(e) => { if (e.key === 'Enter') onClose(); }}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 id="modal-title">Agregar Nuevo Contrato</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label htmlFor="archivo">Agregar contrato</label>
          <div className="form-group">
            <div className="file-upload">
              <input 
                type="file" 
                id="archivo" 
                name="archivo" 
                onChange={handleFileChange} 
                required
              />
            </div>

            <div>
              <label htmlFor="identificador">Identificador</label>
              <input 
                type="text" 
                id="identificador" 
                name="identificador" 
                value={contractInfo.identificador} 
                onChange={handleContractChange} 
                required 
              />
            </div>

            <div>
              <label htmlFor="fechaInicio">Fecha de Inicio</label>
              <input 
                type="date" 
                id="fechaInicio" 
                name="fechaInicio" 
                value={contractInfo.fechaInicio} 
                onChange={handleContractChange} 
                required 
              />
            </div>

            <div>
              <label htmlFor="fechaTermino">Fecha de Término</label>
              <input 
                type="date" 
                id="fechaTermino" 
                name="fechaTermino" 
                value={contractInfo.fechaTermino} 
                onChange={handleContractChange} 
                required 
              />
            </div>
          </div>

          {products.map((product, index) => (
            <ProductForm 
              key={product.id}
              index={index}
              product={product}
              handleProductChange={handleProductChange}
              handleRemoveProduct={handleRemoveProduct} 
            />
          ))}

          <button 
            type="button" 
            className="add-product-button" 
            onClick={handleAddProduct}
          >
            Agregar Otro Producto
          </button>
          
          <button type="submit" className="submit-button">Guardar y Cerrar</button>
        </form>
      </div>
    </div>
  );
}