import React, { useState } from 'react';
import CellModal from './CellModal.jsx';

/**
 * Componente de Mapa de Parqueadero.
 * Renderiza la matriz interactiva de celdas.
 */
function ParkingMap({ celdas, setCeldas, setIngresos }) {
  const [modalCtx, setModalCtx] = useState({ isOpen: false, celda: null, modo: '' });

  // Dispara apertura del modal dependiendo si la celda está libre u ocupada
  const handleCellClick = (celda) => {
    setModalCtx({
      isOpen: true,
      celda: celda,
      modo: celda.ocupado ? 'salida' : 'ingreso'
    });
  };

  const handleModalClose = () => {
    setModalCtx({ ...modalCtx, isOpen: false });
  };

  // Petición a la API para registrar ingreso/salida
  const handleConfirm = async (placaInput) => {
    const { celda, modo } = modalCtx;
    const url = modo === 'ingreso' ? 'http://localhost:3000/api/parking/ingreso' : 'http://localhost:3000/api/parking/salida';
    const body = modo === 'ingreso' ? { numero: celda.numero, placa: placaInput } : { numero: celda.numero };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        // Actualizamos datos pidiendo reporte nuevo al servidor
        if (modo === 'salida') {
          alert(`Checkout Exitoso\nVehículo: ${celda.placa}\nTarifa a cobrar: $${data.tarifaCobrada}`);
        }
        
        // Refetch full state
        const refetch = await fetch('http://localhost:3000/api/parking');
        const newData = await refetch.json();
        setCeldas(newData.celdas);
        if(newData.ingresosAcumulados) setIngresos(newData.ingresosAcumulados);
      }
    } catch(err) {
      alert("Error procesando solicitud en API");
    }

    handleModalClose();
  };

  return (
    <>
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0 }}>Mapa Visual Interactivo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
          {celdas.map(celda => (
            <div 
              key={celda.numero}
              onClick={() => handleCellClick(celda)}
              style={{
                height: '100px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                background: celda.ocupado ? '#ef4444' : '#22c55e',
                color: 'white',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>{celda.numero}</span>
              {celda.ocupado && <span style={{ background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:'4px', marginTop:'5px', fontSize:'0.75rem' }}>{celda.placa}</span>}
            </div>
          ))}
        </div>
      </div>

      {modalCtx.isOpen && (
        <CellModal 
          celda={modalCtx.celda} 
          modo={modalCtx.modo} 
          onClose={handleModalClose} 
          onConfirm={handleConfirm} 
        />
      )}
    </>
  );
}

export default ParkingMap;
