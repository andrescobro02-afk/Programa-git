import React, { useState } from 'react';

/**
 * Modal dinámico para confirmar ingreso o salida del parqueadero.
 */
function CellModal({ celda, modo, onClose, onConfirm }) {
  const [placa, setPlaca] = useState('');

  const submit = () => {
    if (modo === 'ingreso' && !placa) return alert('Ingrese placa');
    onConfirm(placa);
  };

  return (
    <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
      <div style={{ background:'white', padding:'30px', borderRadius:'12px', width:'350px', textAlign:'center' }}>
        <h3 style={{ marginTop:0 }}>
          {modo === 'ingreso' ? 'Ingresar Vehículo' : 'Registrar Salida'}
        </h3>
        <p style={{ color:'#64748b' }}>
          Celda: <strong>{celda.numero}</strong><br/>
          {modo === 'salida' && <span>Vehículo: <strong>{celda.placa}</strong></span>}
        </p>

        {modo === 'ingreso' && (
          <input 
            type="text" 
            placeholder="Placa ej: ABC-123" 
            value={placa} 
            onChange={(e)=>setPlaca(e.target.value.toUpperCase())}
            style={{ width:'100%', padding:'10px', marginBottom:'15px', boxSizing:'border-box', border:'1px solid #cbd5e1', borderRadius:'6px' }}
            autoFocus
          />
        )}

        <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginTop:'20px' }}>
          <button className="btn-secondary" style={{ flex:1 }} onClick={onClose}>Cancelar</button>
          <button className="btn-primary" style={{ flex:1 }} onClick={submit}>Aceptar</button>
        </div>
      </div>
    </div>
  );
}

export default CellModal;
