import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import './ProfessionalProfile.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm5lZnppIiwiYSI6ImNtYjQ3azczNDFrdjkyanIwdm9mZHpjYW0ifQ.oM5jT9V4AYqjDYfZpY3Csw';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

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

  useEffect(() => {
    if (!professional) return;

    // Géocodage avec l'API Mapbox
    const geocodeAddress = async (address) => {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxgl.accessToken}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;

          // Initialiser la map si elle n'existe pas encore
          if (mapInstance.current) {
            mapInstance.current.remove();
          }

          mapInstance.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 15,
          });

          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText(professional.nom))
            .addTo(mapInstance.current);
        }
      } catch (error) {
        console.error('Mapbox geocoding error:', error);
      }
    };

    geocodeAddress(professional.adresse);
  }, [professional]);

  if (loading) return <div className="proprofile-loading">Loading professional profile...</div>;
  if (error) return <div className="proprofile-error">Error: {error}</div>;
  if (!professional) return <div className="proprofile-not-found">Professional not found</div>;

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
              <Link to={`/book/${professional._id}`} className="proprofile-book-btn">
                Make Appointment
              </Link>
            </div>
            <p className="proprofile-specialty">{professional.specialite}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="proprofile-content">
        {/* Left Column */}
        <div className="proprofile-left-col">
          <div className="proprofile-contact-card rounded-5">
            <h3 className="proprofile-card-title">Contact Information</h3>
            <p className="proprofile-contact-item">📧 {professional.email}</p>
            <p className="proprofile-contact-item">📱 {professional.telephone}</p>
            <p className="proprofile-contact-item">🏢 {professional.adresse}</p>
          </div>

          {/* Mapbox Map */}
          <div className="proprofile-map-card rounded-5">
            <h3 className="proprofile-card-title">Location</h3>
            <div ref={mapContainer} className="proprofile-map" style={{ height: '300px' }}></div>
            <p className="proprofile-map-address">{professional.adresse}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="proprofile-right-col rounded-5">
          <div className="proprofile-about">
            <h2 className="proprofile-section-title">About {professional.nom.split(' ')[0]}</h2>
            <p className="proprofile-bio">{professional.bio || 'No biography available.'}</p>
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
                <li className="proprofile-service-item">No services listed</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
