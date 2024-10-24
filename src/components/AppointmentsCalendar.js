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
  
    const statusIcon = event.patient.Status_Cita === 'completado' 
      ? <i className="fas fa-check-circle" style={{ color: 'grey' }}></i>
      : <i className="fas fa-check-circle" style={{ color: 'green' }}></i>;
  
      if (isEventBeingEdited) {
        return (
          <div className="agenda-event-edit" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => handleEditSubmit(e, event)}>
              <input
                type="date"
                value={editFormData.fecha}
                onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
                required
              />
              <input
                type="time"
                value={editFormData.hora}
                onChange={(e) => setEditFormData({ ...editFormData, hora: e.target.value })}
                required
              />
              <button type="submit" className="button button-save">Guardar</button>
              <button type="button" onClick={handleCancelEdit} className="button button-cancel">Cancelar</button>
            </form>
          </div>
        );
      }
  
    return (
      <div className="agenda-event" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', gap: '15px' }}>
        <div>
          <span onClick={handleNameClick} style={{ cursor: 'pointer', color: '#2196F3', textDecoration: 'underline' }}>
            {event.title}
          </span>
          <span style={{ marginLeft: '10px', color: '#666' }}>
            {moment(event.start).format('DD/MM/YYYY HH:mm')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            {statusIcon}
            <span style={{ marginLeft: '5px' }}>
              {event.patient.Status_Cita === 'completado' ? 'Completado' : 'Activa'}
            </span>
          </div>
          <div>
          <button onClick={(e) => handleStatusChange(event)} className="button button-event">
            {event.patient.Status_Cita === 'completado' ? 'Reactivar' : 'Completar'}
          </button>
          <button onClick={handleEditClick} className="button button-event">
            Editar
          </button>
          </div>
        </div>
    </div>
    );
  };  

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
        eventPropGetter={(event) => ({
          style: {
          }
        })}        
      />
    </div>
  );
}

export default AppointmentsCalendar;