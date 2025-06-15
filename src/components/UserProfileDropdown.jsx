import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create a base64 encoded SVG for default user icon
const defaultUserIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c757d'%3E%3Cpath d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.523 0-10 4.477-10 10h20c0-5.523-4.477-10-10-10z'/%3E%3C/svg%3E";

const UserProfileDropdown = ({ onLogout }) => {
  const [userData, setUserData] = useState({
    role: '',
    name: 'Chargement...',
    email: '',
    photo: defaultUserIcon,
    loading: true
  });

  const processPhotoUrl = (photo) => {
    if (!photo) return defaultUserIcon;
    if (photo.startsWith('http')) return photo;
    return `https://deploy-back-3.onrender.com/uploads/${photo}`;
  };

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
       
        // Données initiales depuis le token
        setUserData(prev => ({
          ...prev,
          role: decoded.role,
          name: decoded.nom || 'Utilisateur',
          email: decoded.email,
          photo: processPhotoUrl(decoded.photo),
          loading: false
        }));

        // Récupération des données actualisées
        const response = await axios.get(
          `https://deploy-back-3.onrender.com/api/user/profile/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(prev => ({
          ...prev,
          name: response.data.nom || prev.name,
          email: response.data.email || prev.email,
          photo: processPhotoUrl(response.data.photo),
          loading: false
        }));

      } catch (error) {
        console.error('Erreur:', error);
        setUserData(prev => ({ 
          ...prev, 
          photo: defaultUserIcon,
          loading: false 
        }));
      }
    };

    loadUserData();
  }, []);

  return (
    <Dropdown align="end" className="ms-3">
      <Dropdown.Toggle variant="link" className="btn-profile p-0">
        <img
          src={userData.photo}
          alt="Profile"
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#f8f9fa'
          }}
          onError={(e) => {
            e.target.src = defaultUserIcon;
          }}
          referrerPolicy="no-referrer"
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-end">
        <div className="px-4 py-2">
          <p className="mb-0 fw-bold">{userData.name}</p>
          <small className="text-muted">{userData.email}</small>
        </div>
        <Dropdown.Divider />

        <Dropdown.Item
          as={NavLink}
          to={userData.role === 'professional' ? '/prof' : '/user'}
          className="dropdown-item"
        >
          View Profile
        </Dropdown.Item>

        <Dropdown.Item onClick={onLogout} >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfileDropdown;