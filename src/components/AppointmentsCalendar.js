import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AppointmentsCalendar() {
  const [doctores, setDoctores] = useState([]);
  const [message, setMessage] = useState(''); // Estado para el mensaje de confirmación

  useEffect(() => {
    // Hacer una petición a tu API para obtener los doctores
    axios.get('http://localhost:5000/medicos') // Cambia la ruta a la correcta
      .then(response => {
        setDoctores(response.data); // Guarda los doctores en el estado
      })
      .catch(error => {
        console.error('Error al obtener los doctores:', error);
      });
  }, []);

  const handleSaveChanges = () => {
    // Aquí puedes agregar la lógica para guardar cambios si fuera necesario
    setMessage('Los cambios se han guardado exitosamente!'); // Mensaje de confirmación
    // Reinicia el mensaje después de 2 segundos
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  return (
    <div>
      <h2>Calendario de Citas</h2>
      <button onClick={handleSaveChanges}>Guardar Cambios</button> {/* Botón para guardar cambios */}
      {message && <p>{message}</p>} {/* Mensaje de confirmación */}
      <ul>
        {doctores.map(doctor => (
          <li key={doctor._id}>
            {doctor.nombre} - {doctor.especialidad}
            <ul>
              {doctor.disponibilidad.map(dia => (
                <li key={dia.dia}>
                  {dia.dia}: {dia.horas.map(hora => `${hora.inicio} - ${hora.fin}`).join(', ')}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentsCalendar;
