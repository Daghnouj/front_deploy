import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import './ProfilePage.css';

const AdminProfile = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    phone: '',
    avatar: '',
  });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const { nom, email, phone, photo } = response.data;
      setProfileData({
        ...profileData,
        name: nom,
        email,
        phone,
        avatar: photo ? `http://localhost:5000/uploads/admins/${photo}` : '/default-avatar.jpg',
      });
    } catch (error) {
      showNotification('Error fetching profile', 'danger');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) updateAdminProfile();
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarEdit = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('adminPhoto', file);

      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.put('http://localhost:5000/api/admin/profile-photo', formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        setProfileData({ ...profileData, avatar: `http://localhost:5000/uploads/admins/${response.data.photo}` });
        showNotification('Profile photo updated', 'success');
      } catch (error) {
        showNotification('Error updating photo', 'danger');
      }
    }
  };

  const updateAdminProfile = async () => {
    try {
      const { name, email, phone } = profileData;
      const authToken = localStorage.getItem('authToken');
      const response = await axios.put(
        'http://localhost:5000/api/admin/profile',
        { nom: name, email, phone },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setProfileData({ ...profileData, name: response.data.nom, email: response.data.email });
      showNotification('Profile updated', 'success');
    } catch (error) {
      showNotification('Error updating profile', 'danger');
    }
  };

  const updateAdminPassword = async () => {
    try {
      const { currentPassword, newPassword } = profileData;
      const authToken = localStorage.getItem('authToken');
      await axios.put(
        'http://localhost:5000/api/admin/password',
        { oldPassword: currentPassword, newPassword, confirmPassword: newPassword },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      showNotification('Password updated', 'success');
      setProfileData({ ...profileData, currentPassword: '', newPassword: '' });
    } catch (error) {
      showNotification('Error updating password', 'danger');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000);
  };

  return (
    <div className="admin-profile-container">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="page-title">Admin Profile</h1>
          <button 
            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleEditToggle}
          >
            {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
          </button>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="avatar-section position-relative">
                  <button 
                    className="btn btn-light avatar-edit-btn shadow-sm"
                    onClick={handleAvatarEdit}
                  >
                    <FaEdit />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <img 
                    src={profileData.avatar} 
                    alt="Admin Avatar"
                    className="avatar-img rounded-circle mb-3"
                  />
                  <h3 className="mb-3">{profileData.name}</h3>
                </div>

                <div className="divider my-4"></div>

                <ul className="list-unstyled">
                  <li className="mb-3">
                    <div className="d-flex align-items-center">
                      <FaEnvelope className="info-icon me-3" />
                      <span>{profileData.email}</span>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex align-items-center">
                      <FaPhone className="info-icon me-3" />
                      <span>{profileData.phone}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="mb-4">Account Settings</h2>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={profileData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={profileData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Current Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FaLock />
                            </span>
                            <input
                              type="password"
                              name="currentPassword"
                              className="form-control"
                              value={profileData.currentPassword}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FaLock />
                            </span>
                            <input
                              type="password"
                              name="newPassword"
                              className="form-control"
                              value={profileData.newPassword}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <button 
                          className="btn btn-primary"
                          onClick={updateAdminPassword}
                        >
                          Update Password
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <div className={`notification alert alert-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminProfile;