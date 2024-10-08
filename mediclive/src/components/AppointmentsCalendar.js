import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilos del calendario

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [doctores, setDoctores] = useState([]);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Hacer una petición a tu API para obtener los doctores
    axios.get('http://localhost:5000/medicos') // Cambia la ruta a la correcta
      .then(response => {
        const doctoresData = response.data;
        setDoctores(doctoresData);

        // Convertir la disponibilidad de los doctores en eventos para el calendario
        const calendarEvents = doctoresData.flatMap(doctor =>
          doctor.disponibilidad.flatMap(dia =>
            dia.horas.map(hora => ({
              title: `${doctor.nombre} - ${doctor.especialidad}`,
              start: new Date(`${dia.dia} ${hora.inicio}`),
              end: new Date(`${dia.dia} ${hora.fin}`),
              allDay: false
            }))
          )
        );
        setEvents(calendarEvents);
      })
      .catch(error => {
        console.error('Error al obtener los doctores:', error);
      });
  }, []);

  const handleSaveChanges = () => {
    setMessage('Los cambios se han guardado exitosamente!');
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  return (
    <div>
      <h2>Calendario de Citas</h2>
      <button onClick={handleSaveChanges}>Guardar Cambios</button>
      {message && <p>{message}</p>}
      
      {/* Integrar el calendario */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }} // Ajustar el estilo del calendario
      />
    </div>
  );
}

export default AppointmentsCalendar;
