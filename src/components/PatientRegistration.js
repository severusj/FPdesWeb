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
    EmailFK: '',
    NumeroFK: '',
    DPI: '',
    Fecha_Cita: '',
    Hora_Cita: '',
    Sintomas: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida el formato del correo electrónico
    return emailRegex.test(email);
  };

  const validateDPI = (dpi) => {
    const dpiRegex = /^\d{13}$/; // Valida que el DPI tenga exactamente 13 dígitos numéricos
    return dpiRegex.test(dpi);
  };

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

    // Validación de correo electrónico
    if (!validateEmail(patient.EmailFK)) {
      setModalMessage('Por favor, ingresa un correo electrónico válido.');
      setShowModal(true);
      return;
    }

    // Validación de DPI
    if (!validateDPI(patient.DPI)) {
      setModalMessage('El DPI debe contener exactamente 13 dígitos.');
      setShowModal(true);
      return;
    }

    // Envia la solicitud al servidor
    try {
      const response = await axios.post('http://localhost:5000/register-patient', {
        Nombre_1: patient.Nombre_1,
        Nombre_2: patient.Nombre_2 || null,
        Apellido_1: patient.Apellido_1,
        Apellido_2: patient.Apellido_2 || null,
        EmailFK: patient.EmailFK || null,
        NumeroFK: patient.NumeroFK || null,
        DPI: patient.DPI,
        Fecha_Cita: patient.Fecha_Cita,
        Hora_Cita: patient.Hora_Cita,
        Sintomas: patient.Sintomas
      });
      setModalMessage(response.data.message);
      setShowModal(true);
      setPatient({
        Nombre_1: '',
        Nombre_2: '',
        Apellido_1: '',
        Apellido_2: '',
        EmailFK: '',
        NumeroFK: '',
        DPI: '',
        Fecha_Cita: '',
        Hora_Cita: '',
        Sintomas: ''
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
            type="email"
            className="form-control"
            id="EmailFK"
            name="EmailFK"
            value={patient.EmailFK}
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
            value={patient.NumeroFK}
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
        <div className="mb-3">
          <label htmlFor="Hora_Cita" className="form-label">Hora de Cita</label>
          <input
            type="time"
            className="form-control"
            id="Hora_Cita"
            name="Hora_Cita"
            value={patient.Hora_Cita}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Sintomas" className="form-label">Síntomas</label>
          <textarea
            className="form-control"
            id="Sintomas"
            name="Sintomas"
            value={patient.Sintomas}
            onChange={handleChange}
            placeholder="Describe los síntomas del paciente"
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
