import React, { useState, useCallback } from 'react';
import InventoryTable from '../components/inventoryTable';
import SearchBar from '../components/searchBar';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [isStockFilterActive, setIsStockFilterActive] = useState(false); // Añadido para filtro de stock
  const [refreshKey, setRefreshKey] = useState(0); // Añadido para forzar el refresco

  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const handleFilterOutOfStock = useCallback((isActive) => {
    setIsStockFilterActive(isActive);
  }, []);

  return (
    <div>
      <SearchBar
        onSearch={setSearchQuery}
        onFilter={setFilterLocation}
        onRefresh={handleRefresh}
        onFilterOutOfStock={handleFilterOutOfStock} // Pasar la función de filtro de stock
        isStockFilterActive={isStockFilterActive} // Pasar el estado del filtro de stock
      />
      <InventoryTable
        searchQuery={searchQuery}
        filterLocation={filterLocation}
        isStockFilterActive={isStockFilterActive} // Pasar el estado del filtro de stock
        key={refreshKey}
      />
    </div>
  );
}
