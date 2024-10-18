import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-patient');
        const patients = response.data;
        console.log(patients);
        const appointments = patients.map((patient) => {
          const startDate = moment(`${patient.Fecha_Cita} ${patient.Hora_Cita}`, 'YYYY-MM-DD HH:mm:ss').toDate();
          const endDate = moment(startDate).add(1, 'hour').toDate(); // Asumimos que cada cita dura 1 hora
          return {
            title: `${patient.Nombre_1} ${patient.Apellido_1}`,
            start: startDate,
            end: endDate,
            patient: patient,
          };
        });
        setEvents(appointments);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    fetchPatients();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: '#3174ad',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };

    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate('current');
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
      );
    };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>Anterior</button>
          <button type="button" onClick={goToCurrent}>Hoy</button>
          <button type="button" onClick={goToNext}>Siguiente</button>
        </span>
        <span className="rbc-toolbar-label">{label()}</span>
        <span className="rbc-btn-group">
          {Views.MONTH && (
            <button type="button" onClick={() => toolbar.onView(Views.MONTH)}>Mes</button>
          )}
          {Views.WEEK && (
            <button type="button" onClick={() => toolbar.onView(Views.WEEK)}>Semana</button>
          )}
          {Views.DAY && (
            <button type="button" onClick={() => toolbar.onView(Views.DAY)}>Día</button>
          )}
          {Views.AGENDA && (
            <button type="button" onClick={() => toolbar.onView(Views.AGENDA)}>Agenda</button>
          )}
        </span>
      </div>
    );
  };

  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <br />
      {moment(event.start).format('HH:mm')}
    </div>
  );

  const CustomTooltip = ({ event }) => (
    <div className="custom-tooltip">
      <h3>{event.title}</h3>
      <p>Fecha: {moment(event.start).format('DD/MM/YYYY')}</p>
      <p>Hora: {moment(event.start).format('HH:mm')}</p>
      <p>Teléfono: {event.patient.Telefono}</p>
    </div>
  );

  return (
    <div className="module-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
        }}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          tooltip: CustomTooltip,
        }}
      />
    </div>
  );
}

export default AppointmentsCalendar;