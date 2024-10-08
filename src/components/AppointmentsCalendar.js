// src/components/AppointmentsCalendar.js
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);

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
