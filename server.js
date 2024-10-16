const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configurar la conexión con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'emi123.',
  database: 'medic_live'
});

// Conectar a la base de datos MySQL
db.connect((err) => {
  if (err) {
    console.error('Error conectándose a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Endpoint para la API de ChatGPT
app.post('/chatgpt', async (req, res) => {
  try {
    const { prompt } = req.body;
    const systemMessage = {
      role: 'system',
      content: 'Eres un médico experto. Habla con términos técnicos y proporciona explicaciones detalladas sobre diagnósticos médicos, planes de acción y procesos clínicos.'
    };

    const userMessage = {
      role: 'user',
      content: prompt
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, userMessage],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al comunicarse con la API de OpenAI');
  }
});

app.post('/register-patient', (req, res) => {
  const { Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita } = req.body;

  const sql = 'INSERT INTO Paciente (Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error al registrar paciente' });
      }
      res.status(200).json({ message: 'Paciente registrado con éxito' });
  });
});

app.get ('/get-patient', (req, res) => { 
  const sql = 'SELECT * FROM Paciente';
  db.query(sql, (error, results) => { 
    if (error) {
      return res.status(500).json({ message: 'Error al obtener pacientes' });
    }
    console.log(results)
    res.json(results);
})});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
