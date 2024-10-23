const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configurar la conexión con la base de datos MySQL
async function connectDB(){
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Test12345.',
    database: 'medic_live'
  });

  return connection
}

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

// Endpoint para la API de ChatGPT
app.post('/register-patient', async (req, res) => {
  const { Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita, Sintomas } = req.body;

  const sql = 'INSERT INTO Paciente (Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita, Sintomas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  let connection;

  try {
    connection = await connectDB(); // Conecta a la base de datos
    await connection.query(sql, [Nombre_1, Nombre_2, Apellido_1, Apellido_2, EmailFK, NumeroFK, DPI, Fecha_Cita, Hora_Cita, Sintomas]);

    // Envía el correo después de insertar en la base de datos
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: EmailFK,
      subject: 'Confirmación de Registro de Paciente',
      html: `<div style="font-family: 'Arial', sans-serif; color: #333; background-color: #f9f9f9; padding: 0; margin: 0; width: 100%; height: 100%;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
             
            <!-- Header -->
            <div style="background-image: url('https://www.example.com/banner-image.jpg'); background-size: cover; background-position: center; padding: 20px 0; text-align: center; color: white;">
              <h1 style="font-size: 28px; margin: 0;">¡Tu cita está confirmada!</h1>
            </div>
 
            <!-- Main Content -->
            <div style="padding: 20px 30px; background-color: #ffffff;">
              <h2 style="color: #4CAF50; font-size: 24px;">Confirmación de Registro de Paciente</h2>
              <p style="font-size: 16px;">Hola <strong style="color: #4CAF50;">${Nombre_1}</strong>,</p>
              <p style="font-size: 16px;">Gracias por registrarte en <strong>MedicLive</strong>. Hemos confirmado tu cita con un médico.</p>
               
              <!-- Appointment Details with Icons -->
              <div style="background-color: #f4f4f4; border-radius: 8px; padding: 15px; margin-top: 15px;">
                <p style="font-size: 16px; margin: 0;">
                  <img src="https://forum.nourity.org/uploads/default/original/1X/38b6658eda257c2a5348fe1e037975b53c9e3187.png" alt="Calendario" style="width: 20px; vertical-align: middle; margin-right: 8px;">
                  <strong>Fecha de Cita:</strong> <span style="color: #4CAF50;">${Fecha_Cita}</span>
                </p>
                <p style="font-size: 16px; margin: 10px 0 0 0;">
                  <img src="https://cdn-icons-png.flaticon.com/512/2784/2784459.png" alt="Reloj" style="width: 20px; vertical-align: middle; margin-right: 8px;">
                  <strong>Hora de Cita:</strong> <span style="color: #4CAF50;">${Hora_Cita} hrs</span>
                </p>
              </div>
 
              <!-- Instructions -->
              <p style="font-size: 16px; margin-top: 20px; line-height: 1.6;">Por favor, llega al consultorio 10 minutos antes de tu cita para facilitar el proceso de registro.</p>
            </div>
 
            <!-- Footer -->
            <div style="padding: 20px; background-color: #4CAF50; color: white; text-align: center;">
              <p style="font-size: 16px; margin: 0;">Atentamente,</p>
              <p style="font-size: 16px; margin: 5px 0 20px 0; font-weight: bold;">MedicLive</p>
              <img src="cid:logoMedicLive" alt="MedicLive" style="width: 100px; height: 100px; margin-top: 10px;"/>
              <p style="font-size: 14px; margin-top: 15px; color: #ffffff;">© 2024 MedicLive. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>`, // El contenido del correo que ya tienes
      attachments: [
        {
          filename: 'logomed.png',
          path: './public/utils/logomed.png',
          cid: 'logoMedicLive'
        }
      ]
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado');
      return res.status(200).json({ message: 'Paciente registrado con éxito y correo enviado' });
    } catch (error) {
      console.error('Error al enviar el correo:', mailError);
      return res.status(500).json({ message: 'Paciente registrado, pero ocurrió un error al enviar el correo' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error al registrar paciente o al enviar el correo' });
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión
    }
  }
});


app.get('/get-patient', async (req, res) => { 
  const sql = 'SELECT * FROM Paciente';
  
  let connection;

  try {
    connection = await connectDB();
    const [results] = await connection.query(sql);
    res.json(results);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return res.status(500).json({ message: 'Error al obtener pacientes' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});



// Tu ruta de actualización
// Actualizar el endpoint existente de actualización para incluir el status
app.put('/update-appointment', async (req, res) => {
  const { ID_Paciente, Fecha_Cita, Hora_Cita, Status_Cita } = req.body;

  if (!ID_Paciente || !Fecha_Cita || !Hora_Cita) {
    return res.status(400).json({ 
      message: 'Se requieren ID_Paciente, Fecha_Cita y Hora_Cita' 
    });
  }

  let sql = 'UPDATE paciente SET Fecha_Cita = ?, Hora_Cita = ?';
  let params = [Fecha_Cita, Hora_Cita];

  if (Status_Cita) {
    if (!['activa', 'completado'].includes(Status_Cita)) {
      return res.status(400).json({ 
        message: 'Status_Cita debe ser "activa" o "completado"' 
      });
    }
    sql += ', Status_Cita = ?';
    params.push(Status_Cita);
  }

  sql += ' WHERE ID_Paciente = ?';
  params.push(ID_Paciente);
  
  let connection;

  try {
    connection = await connectDB();
    const [results] = await connection.query(sql, params);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Paciente no encontrado' 
      });
    }
    
    res.status(200).json({ 
      message: 'Cita actualizada con éxito' 
    });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar cita' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.put('/update-appointment-status', async (req, res) => {
  const { ID_Paciente, Status_Cita } = req.body;
  
  if (!ID_Paciente || !Status_Cita) {
    return res.status(400).json({ 
      message: 'Se requieren ID_Paciente y Status_Cita' 
    });
  }
  
  if (!['activa', 'completado'].includes(Status_Cita)) {
    return res.status(400).json({ 
      message: 'Status_Cita debe ser "activa" o "completado"' 
    });
  }
  
  const sql = 'UPDATE paciente SET Status_Cita = ? WHERE ID_Paciente = ?';
  const params = [Status_Cita, ID_Paciente];

  let connection;

  try {
    connection = await connectDB();
    const [results] = await connection.query(sql, params);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Paciente no encontrado' 
      });
    }
    
    res.status(200).json({ 
      message: 'Estado actualizado con éxito' 
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar estado' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});