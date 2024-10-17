import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function PatientRegistration() {
  const [patient, setPatient] = useState({
    Nombre_1: '',
    Nombre_2: '',
    Apellido_1: '',
    Apellido_2: '',
    EmailFK: null, // Inicializa como null, se puede ajustar más tarde
    NumeroFK: null, // Inicializa como null, se puede ajustar más tarde
    DPI: '',
    Fecha_Cita: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verifica que todos los campos requeridos no estén vacíos
    if (!patient.Nombre_1 || !patient.Apellido_1 || !patient.DPI || !patient.Fecha_Cita) {
      setModalMessage('Por favor, completa todos los campos obligatorios.');
      setShowModal(true);
      return;
    }
  
    // Agrega aquí el resto de los campos
    const { Nombre_2, Apellido_2, EmailFK, NumeroFK } = patient;
  
    // Envia la solicitud al servidor
    try {
      const response = await axios.post('http://localhost:5000/register-patient', {
        Nombre_1: patient.Nombre_1,
        Nombre_2: Nombre_2 || null,  // Asigna null si no hay valor
        Apellido_1: patient.Apellido_1,
        Apellido_2: Apellido_2 || null,
        EmailFK: EmailFK || null,
        NumeroFK: NumeroFK || null,
        DPI: patient.DPI,
        Fecha_Cita: patient.Fecha_Cita
      });
      setModalMessage(response.data.message);
      setShowModal(true);
      setPatient({
        Nombre_1: '',
        Nombre_2: '',
        Apellido_1: '',
        Apellido_2: '',
        EmailFK: null,
        NumeroFK: null,
        DPI: '',
        Fecha_Cita: ''
      });
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      setModalMessage('Error al registrar paciente');
      setShowModal(true);
    }
  };
  
  
  const closeModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Registro de Pacientes</h2>
      <form className="shadow-lg p-4 bg-white rounded" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Nombre_1" className="form-label">Primer Nombre</label>
          <input
            type="text"
            className="form-control"
            id="Nombre_1"
            name="Nombre_1"
            value={patient.Nombre_1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Nombre_2" className="form-label">Segundo Nombre</label>
          <input
            type="text"
            className="form-control"
            id="Nombre_2"
            name="Nombre_2"
            value={patient.Nombre_2}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Apellido_1" className="form-label">Primer Apellido</label>
          <input
            type="text"
            className="form-control"
            id="Apellido_1"
            name="Apellido_1"
            value={patient.Apellido_1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Apellido_2" className="form-label">Segundo Apellido</label>
          <input
            type="text"
            className="form-control"
            id="Apellido_2"
            name="Apellido_2"
            value={patient.Apellido_2}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="EmailFK" className="form-label">Correo Electrónico</label>
          <input
            type="mail"
            className="form-control"
            id="EmailFK"
            name="EmailFK"
            value={patient.EmailFK || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="NumeroFK" className="form-label">Número Telefónico</label>
          <input
            type="number"
            className="form-control"
            id="NumeroFK"
            name="NumeroFK"
            value={patient.NumeroFK || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="DPI" className="form-label">DPI</label>
          <input
            type="text"
            className="form-control"
            id="DPI"
            name="DPI"
            value={patient.DPI}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Fecha_Cita" className="form-label">Fecha de Cita</label>
          <input
            type="date"
            className="form-control"
            id="Fecha_Cita"
            name="Fecha_Cita"
            value={patient.Fecha_Cita}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Registrar Paciente</button>
      </form>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registro de Pacientes</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PatientRegistration;
