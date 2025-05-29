import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaCalendarAlt, FaClipboardList, FaEnvelope, FaBars, FaUserCircle, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import "./Dashboard.css";

const DashDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Appeler l'API de déconnexion
    const response = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Échec de la déconnexion');
    }
    // Supprimer le localStorage et mettre à jour l'état après une réponse réussie
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="user-dashboard-container">
      {/* Sidebar */}
      <div 
        className={`user-dashboard-sidebar border-end ${isSidebarOpen ? "user-sidebar-visible" : ""}`}
        ref={sidebarRef}
      >
        <div className="d-flex flex-column h-100">
          <div className="user-sidebar-header p-4 d-flex justify-content-between align-items-center">
            <h4>Dashboard</h4>
            <button className="btn-close btn-close-white d-md-none" onClick={closeSidebar}></button>
          </div>
          
          <ul className="nav flex-column mt-3 flex-grow-1">
            <li className="nav-item">
              <NavLink to="home" className="user-nav-link" onClick={closeSidebar}>
                <FaHome className="me-2" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="calendar" className="user-nav-link" onClick={closeSidebar}>
                <FaCalendarAlt className="me-2" /> Calendar
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="demandes" className="user-nav-link" onClick={closeSidebar}>
                <FaClipboardList className="me-2" /> Requests
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="messages" className="user-nav-link" onClick={closeSidebar}>
                <FaEnvelope className="me-2" /> Messages
              </NavLink>
            </li>
            {/* Added Profile Menu Item */}
            <li className="nav-item">
              <NavLink to="profile" className="user-nav-link" onClick={closeSidebar}>
                <FaUserEdit className="me-2" /> Profile
              </NavLink>
            </li>
          </ul>

          {/* Profile Section at Bottom */}
          <div className="user-sidebar-profile p-4 border-top">
            <button 
              className="btn btn-danger w-100"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="user-main-content">
        {/* Mobile Menu Toggle */}
        {!isSidebarOpen && (
          <button 
            className="user-mobile-menu-toggle btn btn-primary d-md-none"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        )}

        {/* Page Content */}
        <div className="user-content-area">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="user-sidebar-overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default DashDashboard;