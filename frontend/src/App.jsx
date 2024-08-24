import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../src/components/login';
import Home from './pages/home';
import InventoryPage from './pages/inventory';
import SignupPage from '../src/components/signup';
import ProtectedRoute from './utils/ProtectedRoute';
import './App.css'
import UsuariosAmin from './pages/usuariosAdmin';
import MovimientosPage from './components/informeMovimientos';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Home />}/>
      <Route 
        path="/admin" 
        element={
            <ProtectedRoute>
                <UsuariosAmin />
            </ProtectedRoute>
        } 
    />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/informes"
        element={
          <ProtectedRoute>
            <MovimientosPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
