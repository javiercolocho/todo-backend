const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const tasksRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json()); // Analiza solicitudes JSON

// Rutas
app.use('/api/tasks', tasksRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Lista de Tareas funcionando');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
