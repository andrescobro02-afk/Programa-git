import React, { useState, useEffect } from 'react';
import ParkingMap from './ParkingMap.jsx';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

/**
 * Componente principal del Dashboard Administrativo.
 * Se encarga de cargar el estado desde la API y visualizar las estadísticas.
 */
function Dashboard({ onLogout }) {
  const [celdas, setCeldas] = useState([]);
  const [ingresos, setIngresos] = useState(0);
  const [historial, setHistorial] = useState([]);

  // Carga inicial de datos desde la API
  useEffect(() => {
    fetch('http://localhost:3000/api/parking')
      .then(res => res.json())
      .then(data => {
        setCeldas(data.celdas || []);
        setIngresos(data.ingresosAcumulados || 0);
        setHistorial(data.historial || []);
      })
      .catch(err => console.error("Error API:", err));
  }, []);

  const ocupadas = celdas.filter(c => c.ocupado).length;
  const libres = celdas.length - ocupadas;
  const total = celdas.length || 30;

  const pieData = [
    { name: 'Ocupadas', value: ocupadas, color: '#ef4444' },
    { name: 'Libres', value: libres, color: '#22c55e' }
  ];

  // Agrupamos el historial por placa para el char de barras (ultimos 5)
  const barData = historial.slice(-5).map(h => ({
    name: h.placa,
    cobro: h.cobro,
    minutos: h.minutos
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width:'100%' }}>
      {/* Topbar Nav */}
      <header style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, color: '#1e293b' }}>parKing React Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', fontWeight: 'bold', color: '#2563eb' }}>
            Ingresos Totales: ${ingresos.toLocaleString('es-CO')}
          </span>
          <span style={{ marginRight: '20px', fontWeight: 'bold' }}>
            Ocupación: {ocupadas} / {total}
          </span>
          <button className="btn-secondary" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Contenido divido en 2 columnas si es pantalla ancha */}
      <main style={{ padding: '30px', flex: 1, background: '#f8fafc', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {/* Mapa de Parqueadero */}
            <div style={{ flex: '2', minWidth:'500px' }}>
                <ParkingMap celdas={celdas} setCeldas={setCeldas} setIngresos={setIngresos} setHistorial={setHistorial} />
            </div>

            {/* Panel de Gráficos (Estadísticas) */}
            <div style={{ flex: '1', minWidth:'300px', display:'flex', flexDirection:'column', gap:'20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0 }}>Ocupación Actual</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{display:'flex', justifyContent:'center', gap:'15px', fontWeight:'bold', fontSize:'0.9rem'}}>
                        <span style={{color:'#ef4444'}}>■ Ocupado</span>
                        <span style={{color:'#22c55e'}}>■ Libre</span>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0 }}>Últimas Facturaciones</h3>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} width={40} />
                                <Tooltip />
                                <Bar dataKey="cobro" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{textAlign:'center', color:'#94a3b8'}}>No hay historial de cobros aún</p>
                    )}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
