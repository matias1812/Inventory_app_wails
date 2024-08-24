import React from 'react';
import './productModal.css';

function ProductForm({ index, product, handleProductChange, handleRemoveProduct }) {
  return (
    <div className="product-container">
      <div className="product-header">
        <h3 className='product-title'>Producto {index + 1}</h3>
        <button 
          type="button" 
          className="remove-product-button" 
          onClick={() => handleRemoveProduct(index)}
          aria-label="Eliminar producto"
        >
          &times;
        </button>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor={`nombre-${index}`}>Nombre</label>
          <input 
            type="text" 
            id={`nombre-${index}`} 
            name="nombre" 
            value={product.nombre} 
            onChange={(e) => handleProductChange(index, e)} 
            required 
          />
        </div>

        <div>
          <label htmlFor={`descripcion-${index}`}>Descripción</label>
          <input 
            type="text" 
            id={`descripcion-${index}`} 
            name="descripcion" 
            value={product.descripcion} 
            onChange={(e) => handleProductChange(index, e)} 
          />
        </div>

        <div>
          <label htmlFor={`unidad_medida-${index}`}>Unidad de Medida</label>
          <input 
            type="text" 
            id={`unidad_medida-${index}`} 
            name="unidad_medida" 
            value={product.unidad_medida} 
            onChange={(e) => handleProductChange(index, e)} 
            required 
          />
        </div>

        <div>
          <label htmlFor={`stock-inicial-${index}`}>Stock inicial</label>
          <input 
            type="number" 
            id={`stock-inicial-${index}`} 
            name="stock_inicial" 
            value={product.stock_inicial} 
            onChange={(e) => handleProductChange(index, e)} 
            required 
          />
        </div>

        <div>
          <label htmlFor={`status-${index}`}>Estado</label>
          <select 
            id={`status-${index}`} 
            name="status" 
            value={product.status} 
            onChange={(e) => handleProductChange(index, e)}
          >
            <option value="seleccionar">seleccionar</option>
            <option value="faltante">Faltante</option>
            <option value="entregado">Entregado</option>
            <option value="sobrante">Sobrante</option>
          </select>
        </div>

        <div>
          <label htmlFor={`ubicacion-${index}`}>Ubicación</label>
          <select 
            id={`ubicacion-${index}`} 
            name="ubicacion" 
            value={product.ubicacion} 
            onChange={(e) => handleProductChange(index, e)}
          >
            <option value="seleccionar">seleccionar</option>
            <option value="bodega-1">Bodega 1</option>
            <option value="bodega-2">Bodega 2</option>
            <option value="bodega-3">Bodega 3</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
