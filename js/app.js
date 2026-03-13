// ===== APP DE PARQUEADERO INTELIGENTE (Dashboard) =====
const grid = document.getElementById('parkingGrid');

// 30 celdas según el diseño
let totalCeldas = 30; 
let celdas = [];

function formatearFechaHora() {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date();
    return date.toLocaleDateString('es-ES', opciones);
}

function initApp() {
    // Definir la Fecha y Hora en el Topbar
    const datetimeObj = document.getElementById('datetimeDisplay');
    if(datetimeObj) {
        datetimeObj.textContent = formatearFechaHora();
        // Actualizar cada minuto
        setInterval(() => {
            datetimeObj.textContent = formatearFechaHora();
        }, 60000);
    }

    // Crear 30 celdas vacías
    for (let i = 1; i <= totalCeldas; i++) {
        celdas.push({
            numero: i,
            ocupado: false,
        });
    }
    
    // Dejaré todo limpio como en la imagen del usuario (0 vehículos)
    
    renderGrid();
    actualizarOcupacion();
}

function renderGrid() {
    if(!grid) return;
    grid.innerHTML = '';

    celdas.forEach(celda => {
        const div = document.createElement('div');
        div.className = `celda ${celda.ocupado ? 'ocupado' : ''}`;
        
        let htmlContent = `<span>${celda.numero}</span>`;
        div.innerHTML = htmlContent;
        grid.appendChild(div);
    });
}

function actualizarOcupacion() {
    const ocupadas = celdas.filter(c => c.ocupado).length;
    const totalVehiculos = document.getElementById('totalVehiculos');
    if(totalVehiculos) totalVehiculos.textContent = ocupadas;
    
    const capValue = document.getElementById('capacityValue');
    if(capValue) capValue.textContent = `${totalCeldas - ocupadas} / ${totalCeldas}`;
}

document.addEventListener('DOMContentLoaded', initApp);
