const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Doctor = require('./models/Doctor'); // Asegúrate de que esta ruta sea correcta

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Ruta para obtener todos los doctores
app.get('/medicos', async (req, res) => {
  try {
    const doctores = await Doctor.find();
    res.json(doctores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los doctores' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
