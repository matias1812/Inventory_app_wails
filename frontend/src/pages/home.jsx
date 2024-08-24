import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Asegúrate de crear este archivo CSS

function Home() {
  return (
    <div className="home-container">
      <h1>Inventory app</h1>
      <p>Bienvenido al inventario de Akasa</p>
      <div className="button-container">
        <Link to="/signup" className="button-link">
          Sign Up
        </Link>
        <Link to="/login" className="button-link">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
