import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProfessionalProfile.css';
import { Link } from "react-router-dom";

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(`https://deploy-back-3.onrender.com/api/professionals/${id}`);
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
    <div className="proprofile-container" style={{ marginTop: '90px' }}>
      {/* Header Section */}
      <div className="proprofile-header-section">
        <div className="proprofile-header">
          <img
            src={professional.photo ? `https://deploy-back-3.onrender.com/uploads/${professional.photo}` : '/placeholder-professional.jpg'}
            alt={professional.nom}
            className="proprofile-image"
          />
          <div className="proprofile-info">
            <h1 className="proprofile-name">{professional.nom}</h1>
            <div className="proprofile-pricing">
              <p className="proprofile-price">60 DT</p>
              <Link to={`/book/${professional._id}`} className="proprofile-book-btn">
                Book Appointment
              </Link>
            </div>
            <p className="proprofile-specialty">{professional.specialite}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="proprofile-content">
        {/* Left Column */}
        <div className="proprofile-left-col ">
          <div className="proprofile-contact-card rounded-5">
            <h3 className="proprofile-card-title">Contact Information</h3>
            <p className="proprofile-contact-item">
              📧 {professional.email}
            </p>
            <p className="proprofile-contact-item">
              📱 {professional.telephone}
            </p>
            <p className="proprofile-contact-item">
              🏢 {professional.adresse}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="proprofile-right-col rounded-5">
          <div className="proprofile-about">
            <h2 className="proprofile-section-title">
              About {professional.nom.split(' ')[0]}
            </h2>
            <p className="proprofile-bio">
              {professional.bio || 'No biography available.'}
            </p>
          </div>

          <div className="proprofile-services">
            <h2 className="proprofile-section-title">Procedures and care :</h2>
            <ul className="proprofile-services-list">
              {professional.services?.length > 0 ? (
                professional.services.map((service, index) => (
                  <li key={index} className="proprofile-service-item">
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