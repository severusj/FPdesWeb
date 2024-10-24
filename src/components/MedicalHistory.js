import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function MedicalHistory() {
  const [groupedPatients, setGroupedPatients] = useState({});

  useEffect(() => {
    // Llamar al endpoint para obtener los pacientes
    axios.get('http://localhost:5000/get-patient')
      .then(response => {
        const patientsData = response.data;

        // Agrupar pacientes por DPI
        const groupedByDPI = patientsData.reduce((acc, patient) => {
          if (!acc[patient.DPI]) {
            acc[patient.DPI] = [];
          }
          acc[patient.DPI].push(patient);
          return acc;
        }, {});

        setGroupedPatients(groupedByDPI);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  const showHistory = (patientName, patientHistory) => {
    const cardsHTML = patientHistory.map((appointment, index) => (
      `<div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <p><strong>Fecha de cita:</strong> ${new Date(appointment.Fecha_Cita).toLocaleDateString()}</p>
        <p><strong>Hora de cita:</strong> ${appointment.Hora_Cita} hrs.</p>
        <p><strong>Síntomas:</strong> ${appointment.Sintomas}</p>
        <p><strong>Diagnóstico:</strong> ${appointment.Diagnostico || 'No disponible'}</p>
      </div>`
    )).join('');

    Swal.fire({
      title: `Historial de citas del paciente ${patientName}`,
      html: `<div style="text-align: left;">${cardsHTML}</div>`,
      width: '700px',
      confirmButtonText: 'Cerrar',
    });
  };

  return (
    <div className="module-container">
      <h2>Historial Médico</h2>
      <p>Accede al historial médico completo de los pacientes.</p>

      {/* Renderizar pacientes agrupados por DPI */}
      <div className="patient-list">
        {Object.keys(groupedPatients).map(dpi => (
          <div key={dpi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            {/* Mostrar solo el primer paciente por DPI */}
            <div>
              <h3>{groupedPatients[dpi][0].Nombre_1} {groupedPatients[dpi][0].Apellido_1}</h3>
              <p>DPI: {dpi}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => showHistory(`${groupedPatients[dpi][0].Nombre_1} ${groupedPatients[dpi][0].Apellido_1}`, groupedPatients[dpi])}
              style={{ marginLeft: '20px' }}
            >
              Ver Historial
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicalHistory;
