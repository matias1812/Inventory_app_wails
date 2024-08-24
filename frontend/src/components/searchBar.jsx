import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faCog, faUser, faSignOutAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/sessionContext';
import { useNavigate } from 'react-router-dom';
import ProductModal from './productModal';
import './SearchBar.css';

export default function SearchBar({ onSearch, onFilter, onRefresh, onFilterOutOfStock, isStockFilterActive }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { rol, logoutUser } = useAuth();
  const navigate = useNavigate();
  const accordionRef = useRef(null);
  const panelRef = useRef(null);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterClick = (location) => {
    console.log('Selected Location:', location);
    onFilter(location);
  };

  const handleShowAll = () => {
    console.log('Show All');
    onFilter(''); // Envía una cadena vacía para mostrar todos los registros
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClickOutside = useCallback((event) => {
    if (
      accordionRef.current &&
      !accordionRef.current.contains(event.target) &&
      panelRef.current &&
      !panelRef.current.contains(event.target)
    ) {
      setIsAccordionOpen(false);
      setIsPanelOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = () => {
    logoutUser();
  };

  const handleNavigateToAdmin = () => {
    navigate('/admin');
  };

  const handleNavigateToMovimientos = () => {
    navigate('/informes');
  };

  const toggleStockFilter = () => {
    // Alternar el filtro de stock
    onFilterOutOfStock(!isStockFilterActive);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="accordion-container" ref={accordionRef}>
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre o ID del contrato..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="button" className="search-button">
              Buscar
            </button>
          </div>
          <div className="accordion">
            <button type="button" className="accordion-button" onClick={toggleAccordion}>
              Filtrar por bodega
            </button>
            {isAccordionOpen && (
              <div className="accordion-content">
                <button type="button" onClick={() => handleFilterClick('bodega-1')}>
                  bodega-1
                </button>
                <button type="button" onClick={() => handleFilterClick('bodega-2')}>
                  bodega-2
                </button>
                <button type="button" onClick={() => handleFilterClick('bodega-3')}>
                  bodega-3
                </button>
                <button type="button" onClick={handleShowAll}>
                  Mostrar Todos
                </button>
              </div>
            )}
          </div>
          <button type="button" className="add-new-product-button" onClick={openModal}>
            +
          </button>
          <button type="button" className="refresh-button" onClick={onRefresh}>
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
          <button type="button" className="stock-button" onClick={toggleStockFilter}>
            {isStockFilterActive ? 'Con Stock' : 'Sin Stock'}
          </button>
          <button type="button" className="settings-button" onClick={togglePanel}>
            <FontAwesomeIcon icon={faCog} />
          </button>
        </div>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={closeModal} onRefresh={onRefresh} onProductAdded={onRefresh} />

      <div className={`settings-panel ${isPanelOpen ? 'open' : ''}`} ref={panelRef}>
        {rol === 'admin' && (
          <button type="button" className="panel-button" onClick={handleNavigateToAdmin}>
            <FontAwesomeIcon icon={faUser} /> Usuarios
          </button>
        )}
        {rol === 'admin' && (
          <button type="button" className="panel-button" onClick={handleNavigateToMovimientos}>
            <FontAwesomeIcon icon={faChartLine} /> Informes
          </button>
        )}
        <button type="button" className="panel-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
