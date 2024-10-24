import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaClock } from 'react-icons/fa'; // Íconos de estado

const localizer = momentLocalizer(moment);

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);
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
          status: patient.Status_Cita || 'activa',
        };
      });
      setEvents(appointments);
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
    }
  };

  const handleStatusChange = async (eventData) => {
    const newStatus = eventData.patient.Status_Cita === 'activa' ? 'completado' : 'activa';
    
    try {
      const response = await axios.put('http://localhost:5000/update-appointment-status', {
        ID_Paciente: eventData.patient.ID_Paciente,
        Status_Cita: newStatus
      });
      console.log("response", response)
      if (response.data.message) {
        await fetchPatients();
        Swal.fire({
          title: '¡Estado actualizado!',
          text: `La cita ha sido marcada como ${newStatus}`,
          icon: 'success',
          confirmButtonColor: '#2196F3'
        });
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado de la cita', 'error');
    }
  };

  const showPatientInfo = (patient) => {
    Swal.fire({
      title: 'Información del Paciente',
      html: `
        <div style="text-align: left; font-size: 16px;">
          <p style="margin: 10px 0;">
            <strong style="color: #2196F3;">Nombre:</strong> 
            <span style="margin-left: 8px;">${patient.Nombre_1} ${patient.Apellido_1}</span>
          </p>
          <p style="margin: 10px 0;">
            <strong style="color: #2196F3;">DPI:</strong> 
            <span style="margin-left: 8px;">${patient.DPI}</span>
          </p>
          <p style="margin: 10px 0;">
            <strong style="color: #2196F3;">Teléfono:</strong> 
            <span style="margin-left: 8px;">${patient.NumeroFK}</span>
          </p>
          <p style="margin: 10px 0;">
            <strong style="color: #2196F3;">Fecha:</strong> 
            <span style="margin-left: 8px;">${moment(patient.Fecha_Cita).format('DD/MM/YYYY')}</span>
          </p>
          <p style="margin: 10px 0;">
            <strong style="color: #2196F3;">Hora:</strong> 
            <span style="margin-left: 8px;">${moment(patient.Hora_Cita, 'HH:mm:ss').format('HH:mm')} hrs</span>
          </p>
          <p style="margin: 10px 0;">
            <strong style="color: #2196F3;">Estado:</strong> 
            <span style="margin-left: 8px; color: ${patient.Status_Cita === 'completado' ? '#4CAF50' : '#FF9800'}">
              ${patient.Status_Cita || 'activa'}
            </span>
          </p>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#2196F3',
      customClass: {
        title: 'custom-swal-title',
        popup: 'custom-swal-popup'
      }
    });
  };

  const handleEditSubmit = async (e, eventData) => {
    e.preventDefault();
    
    if (!editFormData.fecha || !editFormData.hora) {
      Swal.fire('Campos incompletos', 'Por favor complete todos los campos', 'warning');
      return;
    }
  
    const updateData = {
      ID_Paciente: eventData.patient.ID_Paciente,
      Fecha_Cita: editFormData.fecha,
      Hora_Cita: editFormData.hora + ':00',
      Status_Cita: eventData.patient.Status_Cita // Mantener el estado actual
    };
  
    try {
      const response = await axios.put('http://localhost:5000/update-appointment', updateData);
  
      if (response.data.message) {
        Swal.fire('¡Éxito!', 'Cita actualizada correctamente', 'success');
        await fetchPatients();
        setEditingEventId(null);
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Datos de la respuesta:', error.response?.data);
      Swal.fire('Error', 'Error al actualizar la cita', 'error');
    }
  };

  const handleSelectEvent = (event) => {
    showPatientInfo(event.patient);
  };

  const AgendaEvent = ({ event }) => {
    const isEventBeingEdited = editingEventId === event.id;
    const statusColor = event.patient.Status_Cita === 'completado' ? '#4CAF50' : '#FF9800';

    const handleEditClick = (e) => {
      e.stopPropagation();
      setEditingEventId(event.id);
      setEditFormData({
        fecha: moment(event.start).format('YYYY-MM-DD'),
        hora: moment(event.start).format('HH:mm'),
      });
    };

    const handleNameClick = (e) => {
      e.stopPropagation();
      showPatientInfo(event.patient);
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
          padding: '8px',
          backgroundColor: '#fff',
          borderRadius: '4px',
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
          onClick={handleNameClick}
        >
          {event.patient.Status_Cita === 'completado' ? (
            <FaCheckCircle style={{ color: statusColor }} />
          ) : (
            <FaClock style={{ color: statusColor }} />
          )}
          <strong>{`${event.title} - ${moment(event.start).format('DD/MM/YYYY')} ${moment(event.start).format('HH:mm')} - ${event.patient.Status_Cita || 'activa'}`}</strong>
        </div>
        <div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(event);
            }}
            style={{
              padding: '4px 8px',
              backgroundColor: event.patient.Status_Cita === 'completado' ? '#FF9800' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            {event.patient.Status_Cita === 'completado' ? 'Reabrir' : 'Completar'}
          </button>
          <button 
            onClick={handleEditClick}
            style={{
              padding: '4px 8px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Editar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh' }}
        onSelectEvent={handleSelectEvent}
        components={{
          event: AgendaEvent
        }}
        views={{ month: true, week: true, day: true, agenda: true }}
        defaultView={Views.AGENDA}
      />
    </div>
  );
}

export default AppointmentsCalendar;
