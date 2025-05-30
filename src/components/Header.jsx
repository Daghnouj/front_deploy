import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown';
import '../components/Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const role = localStorage.getItem('role'); 

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Call the logout API
      const response = await fetch('https://deploy-back-3.onrender.com/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Remove localStorage and update state after a successful response
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 fixed-top">
      <div className="container-fluid px-5">
        <NavLink to="/">
          <img src={logo} alt="Logo" style={{ width: '180px', height: 'auto' }} />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Solidarity Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                Solidarity
              </a>
              <ul className="dropdown-menu">
                <li>
                  <NavLink 
                    to="/apropos" 
                    className={({ isActive }) => 
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/contact" 
                    className={({ isActive }) => 
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/professionals" 
                    className={({ isActive }) => 
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Professionals
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Lien conditionnel Reservation/Subscription */}
            <li className="nav-item">
              {isLoggedIn && role === 'professional' ? (
                <NavLink 
                  to="/subscription" 
                  className={({ isActive }) => 
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Subscription
                </NavLink>
              ) : (
                <NavLink 
                  to="/Professionals" 
                  className={({ isActive }) => 
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Reservation
                </NavLink>
              )}
            </li>
            
            <li className="nav-item">
              <NavLink to="/sports" className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }>
                Activities & Centers
              </NavLink>
            </li>

            {/* Community Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                Community & Resources
              </a>
              <ul className="dropdown-menu">
                <li>
                  <NavLink 
                    to="/community" 
                    className={({ isActive }) => 
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Community
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/galerie" 
                    className={({ isActive }) => 
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Gallery
                  </NavLink>
                </li>
              </ul>
            </li>

            {!isLoggedIn && (
              <>
                <li className="nav-item separator"></li>
                <li className="nav-item">
                  <NavLink to="/signup" className={({ isActive }) => 
                    isActive ? "nav-link active" : "nav-link"
                  }>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {isLoggedIn ? (
            <UserProfileDropdown onLogout={handleLogout} />
          ) : (
            <NavLink to="/login" className="btn btn-primary ms-3">
              Log In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;