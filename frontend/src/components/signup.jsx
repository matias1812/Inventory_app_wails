import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../utils/auth';
import { useAuth } from '../utils/sessionContext';
import './auth.css';

function SignupPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [rol, setRol] = useState('usuario');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await signup(nombre, email, contrasena, rol);
      await loginUser(email, contrasena);
      navigate('/inventory');
    } catch (error) {
      console.error('Error en el registro:', error);
      setError(error.message || 'Hubo un problema al registrarse. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-button">Back</Link>
      <div className="auth-form">
        <h2>Registro</h2>
        <form onSubmit={handleSignup}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            name="confirmarContrasena"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="auth-button">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
