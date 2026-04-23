// ===== APP DE PARQUEADERO INTELIGENTE (Dashboard Admin) =====
const grid = document.getElementById('parkingGrid');

// Redirigir si no es admin
if (localStorage.getItem('role') !== 'admin') {
    window.location.href = 'login_admin.html';
}

// 30 celdas según el diseño
let totalCeldas = 30; 
let celdas = [];
let ingresosAcumulados = 0;

function formatearFechaHora() {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date();
    return date.toLocaleDateString('es-ES', opciones);
}

let resolveModal = null;
let currentMode = '';

function openModal(texto, modo) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customModal');
        const textEl = document.getElementById('modalText');
        const inputEl = document.getElementById('modalInput');
        const titleEl = document.getElementById('modalTitle');
        currentMode = modo;
        resolveModal = resolve;
        
        textEl.textContent = texto;
        
        if(modo === 'ingreso') {
            titleEl.textContent = 'Ingresar Nuevo Vehículo';
            inputEl.style.display = 'block';
            inputEl.value = '';
            setTimeout(() => inputEl.focus(), 100);
        } else {
            titleEl.textContent = 'Registrar Salida';
            inputEl.style.display = 'none';
        }
        
        modal.style.display = 'flex';
    });
}

async function initApp() {
    // Definir la Fecha y Hora en el Topbar
    const datetimeObj = document.getElementById('datetimeDisplay');
    if(datetimeObj) {
        datetimeObj.textContent = formatearFechaHora();
        setInterval(() => {
            datetimeObj.textContent = formatearFechaHora();
        }, 60000);
    }

    try {
        const response = await fetch('/api/parking');
        if (!response.ok) throw new Error("Fallo API");
        const data = await response.json();
        celdas = data.celdas || [];
        ingresosAcumulados = data.ingresosAcumulados || 0;
    } catch(e) {
        console.warn("Fallo conexión a la API Node.js. ¿Está corriendo el servidor?", e);
    }
    
    // Configurar el botón de cerrar sesión
    const logoutBtn = document.querySelector('.logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('role');
            window.location.href = 'login_admin.html';
        });
    }
    
    renderGrid();
    actualizarOcupacion();
}

function renderGrid() {
    if(!grid) return;
    grid.innerHTML = '';

    celdas.forEach((celda, index) => {
        const div = document.createElement('div');
        div.className = `celda ${celda.ocupado ? 'ocupado' : ''}`;
        
        let htmlContent = `<span class="cell-number">${celda.numero}</span>`;
        if (celda.ocupado && celda.placa) {
            htmlContent += `<div class="cell-plate" style="margin-top: 5px; font-size: 0.75rem; font-weight: bold; background: rgba(0,0,0,0.3); padding: 2px 5px; border-radius: 4px;">${celda.placa}</div>`;
        }
        div.innerHTML = htmlContent;

        // Make it interactive
        div.style.cursor = 'pointer';
        div.addEventListener('click', async () => {
            if (!celda.ocupado) {
                const placa = await openModal(`Ingresar vehículo en la celda ${celda.numero}.\nPor favor ingrese la placa:`, 'ingreso');
                if (placa && placa.trim().length > 0) {
                    try {
                        const res = await fetch('/api/parking/ingreso', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ numero: celda.numero, placa: placa.trim() })
                        });
                        const data = await res.json();
                        if (data.success) {
                            celdas[index] = data.celda;
                            renderGrid();
                            actualizarOcupacion();
                        }
                    } catch(e) {
                        alert("Error conectando con el servidor en la nube.");
                    }
                }
            } else {
                const confirmar = await openModal(`¿Registrar la salida del vehículo con placa ${celda.placa} de la celda ${celda.numero}?`, 'salida');
                if (confirmar) {
                    try {
                        const res = await fetch('/api/parking/salida', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ numero: celda.numero })
                        });
                        const data = await res.json();
                        if (data.success) {
                            alert(`Checkout Exitoso\nVehiiculo: ${celda.placa}\nTiempo total: ${data.tiempoMinutos} minutos\nTotal a cobrar: $${data.tarifaCobrada}`);
                            
                            celdas[index].ocupado = false;
                            celdas[index].placa = '';
                            celdas[index].horaIngreso = null;
                            ingresosAcumulados = data.ingresosTotales;
                            
                            renderGrid();
                            actualizarOcupacion();
                        }
                    } catch(e) {
                        alert("Error registrando la salida en el servidor.");
                    }
                }
            }
        });

        grid.appendChild(div);
    });
}

function actualizarOcupacion() {
    const ocupadas = celdas.filter(c => c.ocupado).length;
    const totalVehiculos = document.getElementById('totalVehiculos');
    if(totalVehiculos) totalVehiculos.textContent = ocupadas;
    
    const capValue = document.getElementById('capacityValue');
    if(capValue) capValue.textContent = `${totalCeldas - ocupadas} / ${totalCeldas}`;
    
    const ingresosHoyEl = document.getElementById('ingresosHoy');
    if(ingresosHoyEl) {
        const formatoMoneda = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(ingresosAcumulados);
        ingresosHoyEl.textContent = formatoMoneda;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Configurar Modal
    const btnCancel = document.getElementById('btnCancelModal');
    const btnAccept = document.getElementById('btnAcceptModal');

    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            document.getElementById('customModal').style.display = 'none';
            if(resolveModal) resolveModal(null);
        });
    }

    if (btnAccept) {
        btnAccept.addEventListener('click', () => {
            document.getElementById('customModal').style.display = 'none';
            if(resolveModal) {
                if(currentMode === 'ingreso') {
                    resolveModal(document.getElementById('modalInput').value);
                } else {
                    resolveModal(true);
                }
            }
        });
    }
});
