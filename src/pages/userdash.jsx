import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaBars, 
  FaSignOutAlt, 
  FaUserEdit,
  FaGlobe  // Added new icon for public home
} from "react-icons/fa";
import "./userdash.css";

const UserDash = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const toggleSidebarVisibility = () => setIsSidebarVisible(!isSidebarVisible);
  const closeSidebar = () => setIsSidebarVisible(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Appeler l'API de déconnexion
      const response = await fetch('https://deploy-back-3.onrender.com/api/auth/logout', {
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

  return (
    <div className="user-dashboard-container">
      {/* Sidebar */}
      <div 
        className={`user-dashboard-sidebar border-end ${isSidebarVisible ? "user-sidebar-visible" : ""}`}
        ref={sidebarRef}
      >
        <div className="d-flex flex-column h-100">
          <div className="user-sidebar-header p-4 d-flex justify-content-between align-items-center">
            <h4>User Panel</h4>
            <button className="btn-close btn-close-white d-md-none" onClick={closeSidebar}></button>
          </div>
          
          <ul className="nav flex-column mt-3 flex-grow-1">
            {/* New Public Home Link */}
            <li className="nav-item">
              <NavLink to="/" className="user-nav-link" onClick={closeSidebar}>
                <FaGlobe className="me-2" /> Public Home
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="overview" className="user-nav-link" onClick={closeSidebar}>
                <FaHome className="me-2" /> Overview
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="schedule" className="user-nav-link" onClick={closeSidebar}>
                <FaCalendarAlt className="me-2" /> Schedule
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="communications" className="user-nav-link" onClick={closeSidebar}>
                <FaEnvelope className="me-2" /> Communications
              </NavLink>
            </li>
            {/* Profile Menu Item */}
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
        {!isSidebarVisible && (
          <button 
            className="user-mobile-menu-toggle btn btn-primary d-md-none"
            onClick={toggleSidebarVisibility}
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
      {isSidebarVisible && <div className="user-sidebar-overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default UserDash;