import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';
import Swal from 'sweetalert2';

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
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
          id: patient.ID_Paciente,
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

  const handleEditSubmit = async (e, eventData) => {
    e.preventDefault();
    
    if (!editFormData.fecha || !editFormData.hora) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos',
      });
      return;
    }
  
    const updateData = {
      ID_Paciente: eventData.patient.ID_Paciente,
      Fecha_Cita: editFormData.fecha,
      Hora_Cita: editFormData.hora + ':00'
    };
  
    try {
      const response = await axios.put('http://localhost:5000/update-appointment', updateData);
  
      if (response.data.message) {
        Swal.fire({
          icon: 'success',
          title: '¡Cita actualizada!',
          text: response.data.message,
          confirmButtonText: 'OK'
        });
  
        await fetchPatients();
        setEditingEventId(null);
        setIsEditing(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Datos de la respuesta:', error.response?.data);
  
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.message || 'Error al actualizar la cita',
      });
    }
  };

  
  const handleDeleteAppointment = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        await axios.delete(`http://localhost:5000/delete-patient/${selectedEvent.patient.ID_Paciente}`);
        await fetchPatients();
        setSelectedEvent(null);
        alert('Paciente eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        alert('Error al eliminar el paciente');
      }
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setEditFormData({
      fecha: moment(event.start).format('YYYY-MM-DD'),
      hora: moment(event.start).format('HH:mm'),
    });
  };

  // Componente de evento en agenda con formulario de edición inline
  const AgendaEvent = ({ event }) => {
    const isEventBeingEdited = editingEventId === event.id;

    const handleEditClick = (e) => {
      e.stopPropagation();
      setEditingEventId(event.id);
      setEditFormData({
        fecha: moment(event.start).format('YYYY-MM-DD'),
        hora: moment(event.start).format('HH:mm'),
      });
    };

    const handleCancelEdit = (e) => {
      e.stopPropagation();
      setEditingEventId(null);
    };

    if (isEventBeingEdited) {
      return (
        <div 
          className="agenda-event-edit"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <form 
            onSubmit={(e) => handleEditSubmit(e, event)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="date"
              value={editFormData.fecha}
              onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
              required
              style={{
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="time"
              value={editFormData.hora}
              onChange={(e) => setEditFormData({ ...editFormData, hora: e.target.value })}
              required
              style={{
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <button 
              type="submit"
              style={{
                padding: '4px 8px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Guardar
            </button>
            <button 
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '4px 8px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </form>
        </div>
      );
    }

    return (
      <div 
        className="agenda-event"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px'
        }}
      >
        <div>
          <span>{event.title}</span>
          <span style={{ marginLeft: '10px', color: '#666' }}>
            {moment(event.start).format('DD/MM/YYYY HH:mm')}
          </span>
        </div>
        <button 
          onClick={handleEditClick}
          style={{
            padding: '4px 8px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Editar
        </button>
      </div>
    );
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const EventModal = () => (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{selectedEvent.patient.Nombre_1} {selectedEvent.patient.Apellido_1}</h2>
        {isEditing ? (
          <form onSubmit={(e) => handleEditSubmit(e, selectedEvent)} className="edit-form">
            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="date"
                value={editFormData.fecha}
                onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora:</label>
              <input
                type="time"
                value={editFormData.hora}
                onChange={(e) => setEditFormData({ ...editFormData, hora: e.target.value })}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="save-button">Guardar</button>
              <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="patient-info">
            <p><strong>DPI:</strong> {selectedEvent.patient.DPI}</p>
            <p><strong>Fecha:</strong> {moment(selectedEvent.start).format('DD/MM/YYYY')}</p>
            <p><strong>Hora:</strong> {moment(selectedEvent.start).format('HH:mm')}</p>
            <p><strong>Teléfono:</strong> {selectedEvent.patient.NumeroFK}</p>
            <div className="button-group">
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Editar Cita
              </button>
              <button onClick={handleDeleteAppointment} className="delete-button">
                Eliminar
              </button>
            </div>
          </div>
        )}
        <button onClick={closeModal} className="close-button">Cerrar</button>
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
        onSelectEvent={handleSelectEvent}
        components={{
          agenda: {
            event: AgendaEvent
          }
        }}
      />
      {selectedEvent && <EventModal />}
    </div>
  );
}

export default AppointmentsCalendar;