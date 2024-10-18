import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios'; // Importa axios para hacer la petición GET
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);

  // useEffect para obtener datos del servidor
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-patient');
        const patients = response.data;
        console.log(patients)
        // Mapeamos los datos obtenidos en eventos para el calendario
        const appointments = patients.map((patient) => ({
          title: `${patient.Nombre_1} ${patient.Apellido_1}`, 
          start: new Date(patient.Fecha_Cita + ' ' + patient.Hora_Cita), 
          end: new Date(patient.Fecha_Cita + ' ' + patient.Hora_Cita),
        }));

        // Actualiza el estado con los eventos
        setEvents(appointments);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="module-container">
      <h2>Calendario de Citas</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
      />
    </div>
  );
}

export default AppointmentsCalendar;
