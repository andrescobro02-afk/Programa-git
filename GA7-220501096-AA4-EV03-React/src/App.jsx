import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';

/**
 * Componente Principal de la Aplicación (App)
 * Responsable de manejar las rutas y el estado de sesión global (rol).
 * 
 * @returns {JSX.Element} - Router con las vistas de Login y Dashboard
 */
function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = () => {
    localStorage.setItem('role', 'admin');
    setRole('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    setRole(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/dashboard" element={ role === 'admin' ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" /> } />
          <Route path="/login" element={ role === 'admin' ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} /> } />
          <Route path="*" element={<Navigate to={role === 'admin' ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
