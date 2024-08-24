import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setRol, setId, clearAuth } from './authSlice';
import { login } from './auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const rol = useSelector((state) => state.auth.rol);
  const usuario_id = useSelector((state) => state.auth.id);


  const loginUser = async (email, contrasena) => {
    try {
      const data = await login(email, contrasena);
      dispatch(setToken(data.token));
      dispatch(setRol(data.rol));
      dispatch(setId(data.id));
      console.log(data);
    } catch (error) {
      console.error('Error en el login:', error);
      throw error; // Agregar throw para manejar errores en el componente
    }
  };

  const logoutUser = () => {
    dispatch(clearAuth());
  };

  return (
    <AuthContext.Provider value={{ token, rol, usuario_id, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
