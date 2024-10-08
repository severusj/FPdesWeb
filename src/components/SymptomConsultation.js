// src/components/SymptomConsultation.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SymptomConsultation.css';
import { FaPaperPlane } from 'react-icons/fa'; // Icono de envío

function SymptomConsultation() {
  const [symptoms, setSymptoms] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const handleInputChange = (e) => {
    setSymptoms(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResponses([...responses, { user: symptoms, bot: 'Escribiendo...' }]);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/chatgpt`, {
        prompt: symptoms,
      });

      setResponses((prevResponses) => [
        ...prevResponses.slice(0, -1),
        { user: symptoms, bot: response.data.answer },
      ]);
    } catch (error) {
      setResponses((prevResponses) => [
        ...prevResponses.slice(0, -1),
        { user: symptoms, bot: 'Error al obtener respuesta.' },
      ]);
    }

    setLoading(false);
    setSymptoms('');
  };

  // Auto-scroll al final del chat cada vez que se agregue un nuevo mensaje
  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [responses]);

  return (
    <div className="chat-container">
      <h2>Consulta de Síntomas</h2>
      <div className="chat-box" ref={chatBoxRef}>
        {responses.map((response, index) => (
          <div key={index} className="message-container">
            <div className="user-message">
              <p>{response.user}</p>
            </div>
            <div className="bot-message">
              <p>{response.bot}</p>
            </div>
          </div>
        ))}
        {loading && <p className="loading">ChatGPT está escribiendo...</p>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={symptoms}
          onChange={handleInputChange}
          placeholder="Describe la información del paciente y sus síntomas aquí"
          rows="1"
          required
        />
        <button type="submit" className="btn-send">
          <FaPaperPlane size={20} /> {/* Ícono de envío */}
        </button>
      </form>
    </div>
  );
}

export default SymptomConsultation;
