// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
