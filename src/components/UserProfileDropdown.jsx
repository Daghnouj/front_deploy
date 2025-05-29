import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserProfileDropdown = ({ onLogout }) => {
  const [userData, setUserData] = useState({
    role: '',
    name: 'Chargement...',
    email: '',
    photo: '/default-profile.png',
    loading: true
  });

  const processPhotoUrl = (photo) => {
    if (!photo) return '/default-profile.png';
    if (photo.startsWith('http')) return photo;
    return `http://localhost:5000/uploads/${photo}`;
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
          `http://localhost:5000/api/user/profile/${decoded.id}`,
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
        setUserData(prev => ({ ...prev, loading: false }));
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}
  onError={(e) => {
    e.target.src = '/default-profile.png';
  }}
  referrerPolicy="no-referrer" // Correction ici
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