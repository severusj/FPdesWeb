import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importación de FontAwesome

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar la expansión

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Alterna el estado de la barra lateral
  };

  return (
    <div className={`sidebar bg-dark text-light ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header text-center py-4">
        <img 
          src="/utils/logomed.png" 
          alt="MedicLive Logo" 
          className="img-fluid" 
          style={{ maxWidth: '100%' }} 
        />
        <button 
          className="btn btn-light btn-sm" 
          onClick={toggleSidebar} 
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <i className={`fas ${isCollapsed ? 'fa-angle-right' : 'fa-angle-left'}`}></i>
        </button>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-light" to="/registro-pacientes">
            <i className="fas fa-user-plus me-2"></i>
            {!isCollapsed && ' Registro de Pacientes'}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/calendario-citas">
            <i className="fas fa-calendar-alt me-2"></i>
            {!isCollapsed && ' Calendario de Citas'}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/consulta-sintomas">
            <i className="fas fa-stethoscope fa-robot me-2"></i>
            {!isCollapsed && ' Preguntar a LucIA'}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/historial-medico">
            <i className="fas fa-stethoscope me-2"></i>
            {!isCollapsed && ' Historial Médico'}
          </Link>
        </li>
      </ul>

      {/* Estilos adicionales */}
      <style jsx>{`
        .sidebar.collapsed {
          width: 60px; /* Cambia el ancho cuando está colapsado */
        }
        .sidebar.collapsed .nav-link {
          justify-content: center; /* Centra los íconos */
        }
        .sidebar.collapsed .nav-link i {
          margin: 0; /* Elimina el margen para los íconos */
        }
        .sidebar.collapsed .sidebar-header {
          text-align: center; /* Alinea el logotipo al centro */
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
