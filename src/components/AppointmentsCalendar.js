import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fecha: '',
    hora: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-patient');
      const patients = response.data;
      const appointments = patients.map((patient) => {
        const startDate = moment(`${patient.Fecha_Cita} ${patient.Hora_Cita}`, 'YYYY-MM-DD HH:mm:ss').toDate();
        const endDate = moment(startDate).add(1, 'hour').toDate();
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

  const handleEditAppointment = (event) => {
    setIsEditing(true);
    setEditFormData({
      fecha: moment(event.start).format('YYYY-MM-DD'),
      hora: moment(event.start).format('HH:mm'),
    });
  };

  const handleEditSubmit = async (event) => {
    try {
      const { fecha, hora } = editFormData;
      await axios.put(`http://localhost:5000/update-appointment/${selectedEvent.patient.DPI}`, {
        fecha_cita: fecha,
        hora_cita: hora,
      });
      
      await fetchPatients(); // Recargar citas
      setIsEditing(false);
      closeModal();
      alert('Cita actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      alert('Error al actualizar la cita');
    }
  };

  const handleDeleteAppointment = async (event) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        await axios.delete(`http://localhost:5000/delete-appointment/${event.patient.DPI}`);
        setEvents(events.filter(e => e.patient.DPI !== event.patient.DPI));
        closeModal();
        alert('Cita eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
        alert('Error al eliminar la cita');
      }
    }
  };

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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsClosing(false);
    setIsEditing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsClosing(false);
      setIsEditing(false);
    }, 300);
  };

  const EditForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleEditSubmit();
    }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Fecha:</label>
        <input
          type="date"
          value={editFormData.fecha}
          onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Hora:</label>
        <input
          type="time"
          value={editFormData.hora}
          onChange={(e) => setEditFormData({ ...editFormData, hora: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div className="swal-footer">
        <button 
          type="submit" 
          className="swal-button"
          style={{ marginRight: '10px', backgroundColor: '#4CAF50' }}
        >
          Guardar
        </button>
        <button 
          type="button" 
          className="swal-button"
          onClick={() => setIsEditing(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  const EventDetailsModal = ({ event }) => (
    <div className={`swal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
      <div className="swal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="swal-icon swal-icon--info"></div>
        <div className="swal-title">{event.patient.Nombre_1} {event.patient.Apellido_1}</div>
        {isEditing ? (
          <EditForm />
        ) : (
          <>
            <div className="swal-content">
              <p><strong>DPI:</strong> {event.patient.DPI}</p>
              <p><strong>Fecha:</strong> {moment(event.start).format('DD/MM/YYYY')}</p>
              <p><strong>Hora:</strong> {moment(event.start).format('HH:mm')}</p>
              <p><strong>Teléfono:</strong> {event.patient.NumeroFK}</p>
            </div>
            <div className="swal-footer">
              <button 
                className="swal-button swal-button--edit"
                onClick={() => handleEditAppointment(event)}
                style={{ marginRight: '10px', backgroundColor: '#4CAF50' }}
              >
                Editar
              </button>
              <button 
                className="swal-button swal-button--delete"
                onClick={() => handleDeleteAppointment(event)}
                style={{ marginRight: '10px', backgroundColor: '#f44336' }}
              >
                Eliminar
              </button>
              <button className="swal-button" onClick={closeModal}>Cerrar</button>
            </div>
          </>
        )}
      </div>
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
        onSelectEvent={handleSelectEvent}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
        }}
      />
      {selectedEvent && <EventDetailsModal event={selectedEvent} />}
    </div>
  );
}

export default AppointmentsCalendar;