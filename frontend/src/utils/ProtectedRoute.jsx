import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './sessionContext';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  if (!auth) {
    return <Navigate to="/login" />;
  }
  
  const { token } = auth;
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
