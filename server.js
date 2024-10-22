const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
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

// ... (other endpoints remain the same)
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

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/register-patient', (req, res) => {
  const { Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita, Sintomas } = req.body;

  const sql = 'INSERT INTO Paciente (Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita, Sintomas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita, Sintomas], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error al registrar paciente' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: EmailFK,
      subject: 'Confirmación de Registro de Paciente',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Confirmación de Registro de Paciente</h2>
          <p>Hola <strong>${Nombre_1}</strong>,</p>
          <p>Gracias por registrarte en <strong>MedicLive</strong>. Hemos confirmado tu cita médica.</p>
          <p><strong>Fecha de Cita:</strong> ${Fecha_Cita}</p>
          <p><strong>Hora de Cita:</strong> ${Hora_Cita} hrs</p>
          <br>
          <p>Por favor, llega al consultorio 10 minutos antes de tu cita.</p>
          <br>
          <p>Atentamente,</p>
          <p><strong>MedicLive</strong></p>
          <img src="cid:logoMedicLive" alt="MedicLive" style="width: 300px; height: 300px;"/>
        </div>
      `,
      attachments: [
        {
          filename: 'logomed.png',
          path: './public/utils/logomed.png',
          cid: 'logoMedicLive'
        }
      ]
    };
    

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        return res.status(500).json({ message: 'Paciente registrado pero ocurrió un error al enviar el correo' });
      }

      console.log('Correo enviado: ' + info.response);
      res.status(200).json({ message: 'Paciente registrado con éxito y correo enviado' });
    });
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


// Update the update-appointment endpoint
// Tu ruta de actualización
app.put('/update-appointment', (req, res) => {
  const { ID_Paciente, Fecha_Cita, Hora_Cita } = req.body;

  if (!ID_Paciente || !Fecha_Cita || !Hora_Cita) {
    return res.status(400).json({ message: 'Se requieren ID_Paciente, Fecha_Cita y Hora_Cita' });
  }

  const sql = 'UPDATE paciente SET Fecha_Cita = ?, Hora_Cita = ? WHERE ID_Paciente = ?';
  
  db.query(sql, [Fecha_Cita, Hora_Cita, ID_Paciente], (error, results) => {
    if (error) {
      console.error('Error al actualizar cita:', error);
      return res.status(500).json({ message: 'Error al actualizar cita' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.status(200).json({ message: 'Cita actualizada con éxito' });
  });
});


// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});