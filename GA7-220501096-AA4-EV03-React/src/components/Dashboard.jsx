import React, { useState, useEffect } from 'react';
import ParkingMap from './ParkingMap.jsx';

/**
 * Componente principal del Dashboard Administrativo.
 * Se encarga de cargar el estado desde la API y visualizar las estadísticas.
 *
 * @param {Object} props
 * @param {Function} props.onLogout - Función para cerrar sesión.
 */
function Dashboard({ onLogout }) {
  const [celdas, setCeldas] = useState([]);
  const [ingresos, setIngresos] = useState(0);

  // Carga inicial de datos desde la API
  useEffect(() => {
    fetch('http://localhost:3000/api/parking')
      .then(res => res.json())
      .then(data => {
        setCeldas(data.celdas || []);
        setIngresos(data.ingresosAcumulados || 0);
      })
      .catch(err => console.error("Error API:", err));
  }, []);

  const ocupadas = celdas.filter(c => c.ocupado).length;
  const total = celdas.length || 30;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Topbar Nav */}
      <header style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, color: '#1e293b' }}>parKing React Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', fontWeight: 'bold', color: '#2563eb' }}>
            Ingresos Hoy: ${ingresos.toLocaleString('es-CO')}
          </span>
          <span style={{ marginRight: '20px', fontWeight: 'bold' }}>
            Ocupación: {ocupadas} / {total}
          </span>
          <button className="btn-secondary" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Contenido */}
      <main style={{ padding: '30px', flex: 1, background: '#f8fafc', overflowY: 'auto' }}>
        <ParkingMap celdas={celdas} setCeldas={setCeldas} setIngresos={setIngresos} />
      </main>
    </div>
  );
}

export default Dashboard;
