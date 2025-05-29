import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  FaHome, 
  FaUsers, 
  FaUser,
  FaImage, 
  FaCalendarDay, 
  FaHandshake, 
  FaClipboardCheck, 
  FaBars, 
  FaSignOutAlt 
} from "react-icons/fa";
import "./AdminDash.css";




const AdminDash = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const closeSidebar = () => setIsSidebarVisible(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="admindash-container">
      {/* Sidebar */}
      <div 
        className={`admindash-sidebar ${isSidebarVisible ? "admindash-visible" : ""}`}
        ref={sidebarRef}
      >
        <div className="admindash-sidebar-content">
          <div className="admindash-sidebar-header">
            <h3>Admin Panel</h3>
            <button 
              className="admindash-close-btn" 
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>

          <nav className="admindash-sidebar-nav">
            <NavLink 
              to="overview" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaHome className="admindash-nav-icon" />
              <span>Overview</span>
            </NavLink>
            <NavLink 
              to="users" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaUsers className="admindash-nav-icon" />
              <span>Users</span>
            </NavLink>
            <NavLink 
              to="profile" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaUser className="admindash-nav-icon" />
              <span>Edit Profile</span>
            </NavLink>
            <NavLink 
              to="galerie" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaImage className="admindash-nav-icon" />
              <span>Galerie</span>
            </NavLink>
            <NavLink 
              to="events" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaCalendarDay className="admindash-nav-icon" />
              <span>Events</span>
            </NavLink>
            <NavLink 
              to="partenaires" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaHandshake className="admindash-nav-icon" />
              <span>Partners</span>
            </NavLink>
            <NavLink 
              to="demandes" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              <FaClipboardCheck className="admindash-nav-icon" />
              <span>requests</span>
            </NavLink>
          </nav>

          <div className="admindash-sidebar-footer">
            <NavLink 
  to="/admin/logout" 
  className="admindash-logout-btn" 
  onClick={closeSidebar}
>
  <FaSignOutAlt className="admindash-nav-icon" />
  <span>Déconnexion</span>
</NavLink>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admindash-main">
        <button 
          className="admindash-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        
        <div className="admindash-content-area">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarVisible && (
        <div 
          className="admindash-sidebar-overlay" 
          onClick={closeSidebar}
          role="presentation"
        />
      )}
    </div>
  );
};

export default AdminDash;