import React, { useState } from 'react';

/**
 * Componente de Login Administrativo
 * Permite al administrador ingresar al sistema validando credenciales locales.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onLogin - Función que se ejecuta cuando el login es válido
 */
function Login({ onLogin }) {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('admin123');
  const [error, setError] = useState(false);

  /**
   * Valida los datos y dispara la función padre si es correcto
   */
  const handleIngresar = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin123') {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'linear-gradient(135deg, #1e293b, #e2e8f0)' }}>
      <div style={{ background:'white', padding:'3rem', borderRadius:'12px', boxShadow:'0 10px 25px rgba(0,0,0,0.1)', width:'400px' }}>
        <h2 style={{ textAlign:'center', color:'#2563eb', marginBottom:'2rem' }}>Acceso Administrador parKing</h2>
        
        <form onSubmit={handleIngresar}>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', marginBottom:'5px', fontWeight:'600' }}>Usuario</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} style={{ width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #cbd5e1', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ display:'block', marginBottom:'5px', fontWeight:'600' }}>Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #cbd5e1', boxSizing:'border-box' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width:'100%' }}>Ingresar al Sistema</button>
          
          {error && <p style={{ color:'red', textAlign:'center', marginTop:'10px', fontSize:'0.9rem' }}>Credenciales inválidas.</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
