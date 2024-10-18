import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Importación de FontAwesome

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-light">
      <div className="sidebar-header text-center py-4">
        <img src="/utils/logomed.png" alt="MedicLive Logo" className="img-fluid" style={{ maxWidth: '100%' }} />
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-light" to="/registro-pacientes">
            <i className="fas fa-user-plus me-2"></i> Registro de Pacientes
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/calendario-citas">
            <i className="fas fa-calendar-alt me-2"></i> Calendario de Citas
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/consulta-sintomas">
            <i className="fas fa-stethoscope fa-robot me-2"></i> Preguntar a LucIA
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/historial-medico">
            <i className="fas fa-stethoscope me-2"></i> Historial Médico
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
