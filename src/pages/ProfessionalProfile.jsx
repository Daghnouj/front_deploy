import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import './ProfessionalProfile.css';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/professionals/${id}`);
        setProfessional(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return <div className="proprofile-loading">Loading professional profile...</div>;
  }

  if (error) {
    return <div className="proprofile-error">Error: {error}</div>;
  }

  if (!professional) {
    return <div className="proprofile-not-found">Professional not found</div>;
  }

  return (
    <div className="proprofile-container">
      {/* Header Section */}
      <div className="proprofile-header-section">
        <div className="proprofile-header">
          <div className="proprofile-image-wrapper">
            <img
              src={professional.photo ? `http://localhost:5000/uploads/${professional.photo}` : '/placeholder-professional.jpg'}
              alt={professional.nom}
              className="proprofile-image"
            />
          </div>
          
          <div className="proprofile-info">
            <div className="proprofile-info-header">
              <h1 className="proprofile-name">{professional.nom}</h1>
              <Link to={`/book/${professional._id}`} className="proprofile-book-btn">
                Book Appointment
              </Link>
            </div>
            
            <p className="proprofile-specialty">{professional.specialite}</p>
            <p className="proprofile-location">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              {professional.adresse}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="proprofile-content">
        {/* Left Column */}
        <div className="proprofile-left-col">
          <div className="proprofile-card proprofile-contact-card">
            <h3 className="proprofile-card-title">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Contact Information
            </h3>
            <p className="proprofile-contact-item">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
              </svg>
              {professional.email}
            </p>
            <p className="proprofile-contact-item">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {professional.telephone}
            </p>
            <p className="proprofile-contact-item">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-1-1 1V4zm9 16H6V4h1v9l3-2 3 2V4h1v16z"/>
              </svg>
              {professional.adresse}
            </p>
          </div>

          <div className="proprofile-card proprofile-availability-card">
            <h3 className="proprofile-card-title">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              Professional Details
            </h3>
            {professional.situation_professionnelle && (
              <p className="proprofile-detail-item">
                <svg className="proprofile-icon" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                Situation: {professional.situation_professionnelle}
              </p>
            )}
            {professional.intitule_diplome && (
              <p className="proprofile-detail-item">
                <svg className="proprofile-icon" viewBox="0 0 24 24">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
                Diploma: {professional.intitule_diplome}
              </p>
            )}
            {professional.nom_etablissement && (
              <p className="proprofile-detail-item">
                <svg className="proprofile-icon" viewBox="0 0 24 24">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
                Institution: {professional.nom_etablissement}
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="proprofile-right-col">
          <div className="proprofile-about">
            <h2 className="proprofile-section-title">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              About {professional.nom.split(' ')[0]}
            </h2>
            <p className="proprofile-bio">
              {professional.biographie || 'No biography available.'}
            </p>
          </div>

          <div className="proprofile-services">
            <h2 className="proprofile-section-title">
              <svg className="proprofile-icon" viewBox="0 0 24 24">
                <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/>
              </svg>
              Services Offered
            </h2>
            <ul className="proprofile-services-list">
              {professional.services?.length > 0 ? (
                professional.services.map((service, index) => (
                  <li key={index} className="proprofile-service-item">
                    <svg className="proprofile-icon" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    {service}
                  </li>
                ))
              ) : (
                <li className="proprofile-service-item">
                  No services listed
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;