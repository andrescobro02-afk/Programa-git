// ===== LOGICA DE LOGIN =====

function switchTab(tab) {
    // Esconder todos
    document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));

    // Mostrar seleccionado
    document.getElementById(`form-${tab}`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    // Ocultar mensajes de error
    document.getElementById('error-cliente').style.display = 'none';
    document.getElementById('error-admin').style.display = 'none';
}

function loginAdmin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('error-admin');

    if (user === 'admin' && pass === 'admin123') {
        localStorage.setItem('role', 'admin');
        window.location.href = 'index.html'; // Redirige al Dashboard
    } else {
        errorMsg.style.display = 'block';
    }
}

function loginCliente() {
    const placaIngresada = document.getElementById('placa').value.trim().toUpperCase();
    const errorMsg = document.getElementById('error-cliente');
    
    if(!placaIngresada) {
        errorMsg.textContent = 'Por favor ingrese una placa válida.';
        errorMsg.style.display = 'block';
        return;
    }

    // Buscar si el vehículo está en localStorage
    let celdasStorage = localStorage.getItem('parKing_celdas');
    if (celdasStorage) {
        let celdas = JSON.parse(celdasStorage);
        let vehiculoEncontrado = celdas.find(c => c.ocupado && c.placa === placaIngresada);
        
        if (vehiculoEncontrado) {
            localStorage.setItem('role', 'cliente');
            localStorage.setItem('placaActual', placaIngresada);
            window.location.href = 'user_dashboard.html'; // Redirige al panel de usuario
        } else {
            errorMsg.textContent = 'Vehículo no registrado en este momento.';
            errorMsg.style.display = 'block';
        }
    } else {
        errorMsg.textContent = 'Sistema no inicializado o vacío.';
        errorMsg.style.display = 'block';
    }
}
