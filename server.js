const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la carpeta actual
app.use(express.static(path.join(__dirname)));

// Simular una base de datos en JSON local
const dataPath = path.join(__dirname, 'parking_data.json');

// Inicializar data si no existe
function loadData() {
    if (!fs.existsSync(dataPath)) {
        const initialData = { celdas: [], ingresosAcumulados: 0 };
        for (let i = 1; i <= 30; i++) {
            initialData.celdas.push({
                numero: i,
                ocupado: false,
                placa: "",
                horaIngreso: null
            });
        }
        saveData(initialData);
        return initialData;
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
}

function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

let db = loadData();

// --- API Endpoints ---

// Obtener todas las celdas y estado
app.get('/api/parking', (req, res) => {
    res.json(db);
});

// Registrar ingreso
app.post('/api/parking/ingreso', (req, res) => {
    const { numero, placa } = req.body;
    const celda = db.celdas.find(c => c.numero === numero);
    
    if (celda && !celda.ocupado) {
        celda.ocupado = true;
        celda.placa = placa.toUpperCase();
        celda.horaIngreso = new Date().toISOString();
        saveData(db);
        res.json({ success: true, celda });
    } else {
        res.status(400).json({ success: false, message: 'Celda ocupada o inválida' });
    }
});

// Registrar salida (checkout)
app.post('/api/parking/salida', (req, res) => {
    const { numero } = req.body;
    const celda = db.celdas.find(c => c.numero === numero);
    
    if (celda && celda.ocupado) {
        const ahora = new Date();
        const ingreso = new Date(celda.horaIngreso);
        const minutosTotales = Math.floor((ahora - ingreso) / 1000 / 60);
        
        let tarifa = (minutosTotales + 1) * 100;
        if (tarifa < 500) tarifa = 500;
        
        // Efectuar cobro
        db.ingresosAcumulados += tarifa;
        
        // Liberar
        celda.ocupado = false;
        celda.placa = '';
        celda.horaIngreso = null;
        
        saveData(db);
        
        res.json({ 
            success: true, 
            tiempoMinutos: minutosTotales, 
            tarifaCobrada: tarifa,
            ingresosTotales: db.ingresosAcumulados 
        });
    } else {
        res.status(400).json({ success: false, message: 'Celda libre o inválida' });
    }
});

// Login y búsqueda de vehículo para cliente
app.post('/api/parking/cliente', (req, res) => {
    const { placa } = req.body;
    const p = placa.toUpperCase();
    const vehiculo = db.celdas.find(c => c.ocupado && c.placa === p);
    if (vehiculo) {
        res.json({ success: true, vehiculo });
    } else {
        res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor parKing corriendo en http://localhost:${PORT}`);
});
