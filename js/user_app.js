// ===== LOGICA DEL DASHBOARD DE USUARIO =====

function initUserApp() {
    // Validar si es un cliente real
    const role = localStorage.getItem('role');
    const placaActual = localStorage.getItem('placaActual');

    if (role !== 'cliente' || !placaActual) {
        window.location.href = 'login_user.html';
        return;
    }

    // Traer datos del parqueadero
    const celdasStorage = localStorage.getItem('parKing_celdas');
    if (!celdasStorage) {
        window.location.href = 'login_user.html';
        return;
    }
    
    const celdas = JSON.parse(celdasStorage);
    const miVehiculo = celdas.find(c => c.ocupado && c.placa === placaActual);

    if (!miVehiculo) {
        // Vehículo ya salió
        alert("Su vehículo ya no se encuentra registrado en el parqueadero.");
        localStorage.removeItem('role');
        localStorage.removeItem('placaActual');
        window.location.href = 'login_user.html';
        return;
    }

    // Pintar Datos Iniciales
    document.getElementById('u-placa').textContent = miVehiculo.placa;
    document.getElementById('u-celda').textContent = `# ${miVehiculo.numero}`;
    
    const fechaIngreso = new Date(miVehiculo.horaIngreso);
    document.getElementById('u-ingreso').textContent = fechaIngreso.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit'
    });

    // Actualizar tiempo y tarifa cada segundo
    actualizarCronometro(fechaIngreso);
    setInterval(() => actualizarCronometro(fechaIngreso), 1000);
}

function actualizarCronometro(fechaIngreso) {
    const ahora = new Date();
    const diferenciaMs = ahora - fechaIngreso;
    
    // Calcular minutos y horas
    const minutosTotales = Math.floor(diferenciaMs / 1000 / 60);
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;

    // Mostrar tiempo
    let textoTiempo = '';
    if (horas > 0) {
        textoTiempo += `${horas}h `;
    }
    textoTiempo += `${minutos}m`;
    
    // Mostrar 0m si acaba de entrar
    if (minutosTotales === 0 && horas === 0) textoTiempo = "Menos de 1m";
    
    document.getElementById('u-tiempo').textContent = textoTiempo;

    // Calcular Tarifa ($100 el minuto, redondeado hacia arriba o fijo mínimo temporal)
    const tarifaPorMinuto = 100;
    const tarifaMinima = 500; // Al menos $500 por entrar

    let totalPagar = (minutosTotales + 1) * tarifaPorMinuto; // Se cobra al menos el minuto en curso
    if (totalPagar < tarifaMinima) totalPagar = tarifaMinima;

    const formatoMoneda = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(totalPagar);

    document.getElementById('u-tarifa').textContent = formatoMoneda;
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', initUserApp);
