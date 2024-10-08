// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PatientRegistration from './components/PatientRegistration';
import AppointmentsCalendar from './components/AppointmentsCalendar';
import SymptomConsultation from './components/SymptomConsultation';
import MedicalHistory from './components/MedicalHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<h2>Bienvenido a MedicLive</h2>} />
          <Route path="/registro-pacientes" element={<PatientRegistration />} />
          <Route path="/calendario-citas" element={<AppointmentsCalendar />} />
          <Route path="/consulta-sintomas" element={<SymptomConsultation />} />
          <Route path="/historial-medico" element={<MedicalHistory />} />
        </Routes>
        <footer>
          MedicLive © 2024
        </footer>
      </div>
    </Router>
  );
}

export default App;
