import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../utils/useApi'; // Asegúrate de que la ruta sea correcta
import './UsuariosAdmin.css';  

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const navigate = useNavigate();

  // Fetch usuarios al montar el componente
  const [usuariosData, loadingUsuarios, errorUsuarios] = useApi('usuarios', 'GET');

  useEffect(() => {
    if (usuariosData) {
      setUsuarios(usuariosData);
      // Inicializa selectedRoles con los roles actuales
      const initialRoles = usuariosData.reduce((acc, usuario) => {
        acc[usuario.id] = usuario.rol;
        return acc;
      }, {});
      setSelectedRoles(initialRoles);
    }
  }, [usuariosData]);

  useEffect(() => {
    if (errorUsuarios) {
      console.error('Error al obtener los usuarios:', errorUsuarios);
    }
  }, [errorUsuarios]);

  const handleSaveRol = async (usuarioId) => {
    const nuevoRol = selectedRoles[usuarioId];
    try {
      // Realiza la llamada a la API directamente sin hooks
      const response = await fetch(`${import.meta.env.VITE_SOME_KEY}/usuarios/${usuarioId}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: nuevoRol }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el rol: ${response.statusText}`);
      }

      // Actualiza el estado después de la respuesta exitosa
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioId ? { ...usuario, rol: nuevoRol } : usuario
      ));
      alert('Rol actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
    }
  };

  const handleNavigateToInventory = () => {
    navigate('/inventory'); // Navegar a la ruta /inventory
  };

  if (loadingUsuarios) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <button type='button' onClick={handleNavigateToInventory} className="back-button">Volver al Inventario</button> {/* Botón Volver */}
      <h1>Admin</h1>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <select
                    value={selectedRoles[usuario.id] || usuario.rol}
                    onChange={(e) => {
                      const nuevoRol = e.target.value;
                      setSelectedRoles(prev => ({
                        ...prev,
                        [usuario.id]: nuevoRol
                      }));
                    }}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button type='button' onClick={() => handleSaveRol(usuario.id)}>Guardar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
