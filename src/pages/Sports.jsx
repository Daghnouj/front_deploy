import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SportsRooms.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Link } from 'react-router-dom';

// Configuration Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm5lZnppIiwiYSI6ImNtYjQ3azczNDFrdjkyanIwdm9mZHpjYW0ifQ.oM5jT9V4AYqjDYfZpY3Csw';

const TherapyRooms = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Load rooms only if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await fetch('https://deploy-back-3.onrender.com/api/events');
        if (!response.ok) throw new Error('Erreur lors du chargement des salles');
        const data = await response.json();
        
        // CORRECTION: Ajouter des valeurs par défaut pour les propriétés manquantes
        const processedData = data.map(room => ({
          ...room,
          activities: room.activities || [],  // Tableau vide si activities est manquant
          images: room.images || []           // Tableau vide si images est manquant
        }));
        
        setRooms(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [isLoggedIn]);

  // Initialize map only if logged in and rooms are available
  useEffect(() => {
    if (!isLoggedIn || !mapContainer.current || rooms.length === 0) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10, 34.5],
      zoom: 5
    });

    map.current.on('load', () => {
      rooms.forEach(room => {
        if (!room.coordinates) return;
        
        const [lat, lng] = room.coordinates.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) return;
        
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setText(room.name))
          .addTo(map.current);
      });
    });

    return () => map.current?.remove();
  }, [rooms, isLoggedIn]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.activities || []).some(activity => 
      activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleImageClick = (room, index) => {
    setSelectedRoom(room);
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const handlePrev = () => {
    setCurrentImageIndex(prev => 
      (prev - 1 + selectedRoom.images.length) % selectedRoom.images.length
    );
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => 
      (prev + 1) % selectedRoom.images.length
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="sports-facilities-container" style={{ marginTop: '85px', minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-content-center py-5">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 mt-5">
                <div className="card-body p-5 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#007bff" className="bi bi-shield-lock mb-4" viewBox="0 0 16 16">
                    <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                    <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
                  </svg>
                  
                  <h3 className="mb-3">Accès Restreint</h3>
                  <p className="text-muted mb-4">
                    Connectez-vous pour découvrir nos salles de sport partenaires et réserver vos séances.
                  </p>
                  
                  <div className="d-grid gap-3">
                    <Link to="/login" className="btn btn-primary btn-lg rounded-pill py-3">
                      Se connecter
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary btn-lg rounded-pill py-3">
                      Créer un compte
                    </Link>
                  </div>
                  
                  <div className="mt-4">
                    <Link to="/" className="text-decoration-none">
                      <i className="bi bi-arrow-left me-2"></i>Retour à l'accueil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sports-facilities-container" style={{ marginTop: '85px' }}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement en cours...</span>
          </div>
          <p className="mt-3">Chargement des salles en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sports-facilities-container" style={{ marginTop: '85px' }}>
        <div className="alert alert-danger mx-auto my-5" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="sports-facilities-container" style={{ marginTop: '85px' }}>
      {/* Hero Banner */}
      <section className="sports-banner">
        <div className="sports-banner-overlay">
          <div className="container">
            <div>
              <h3 className="sports-banner-title text-center fw-bold">Our partners for a healthy body and a peaceful mind</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="sports-main-content">
        <div className="container">
          <div className="row mb-4"> 
            <div className="col-md-3"></div>
            <div className="col-md-4">
              <input
                type="search"
                className="form-control border-dark rounded-5"
                placeholder="Search..."
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-2">
              <select className="form-select border-dark rounded-5">
                <option value="">Find by...</option>
                <option value="sport">Type de sport</option>
                <option value="price">Fourchette de prix</option>
                <option value="rating">Évaluation</option>
              </select>
            </div>
          </div>
          
          <div className="row g-4 sports-rooms-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div key={room._id} className="col-md-6 col-lg-4 col-xl-3">
                  <article className="sports-room-card rounded-5">
                    <div className="sports-room-image-container">
                      <Carousel indicators={false} controls={false} interval={null}>
                        {(room.images || []).map((img, index) => (
                          <Carousel.Item key={index}>
                            <img 
                              src={`https://deploy-back-3.onrender.com/${img}`} 
                              alt={room.name}
                              className="sports-room-image"
                              onClick={() => handleImageClick(room, index)}
                              role="button"
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                    <div className="sports-room-info">
                      <h3 className="sports-room-name">{room.name}</h3>
                      <div className="sports-room-address">
                        <i className="bi bi-geo-alt sports-address-icon"></i>
                        <span>{room.address}</span>
                      </div>
                      
                      <div className="sports-room-activities">
                        <div className="sports-activities-scroller">
                          {/* CORRECTION: Utiliser un tableau vide si activities est undefined */}
                          {(room.activities || []).map((activity, index) => (
                            <div key={index} className="sports-activity-badge">
                              <i className="bi bi-circle-fill sports-activity-bullet"></i>
                              <div className="sports-activity-content">
                                <span className="sports-activity-name">{activity.name}</span>
                                <span className="sports-activity-day">{activity.day}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="sports-room-description">{room.description}</p>
                    </div>
                  </article>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4>Aucune salle ne correspond à votre recherche</h4>
                <p className="text-muted">Essayez d'autres termes de recherche</p>
              </div>
            )}
          </div>
        </div>
        
        <div className='container mt-5'>
          <h1 className='text-center mt-5 mb-5 text-black fw-bolder'>Find exclusive events near you</h1>
          <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
        </div>
      </main>

      {/* Lightbox */}
      {showLightbox && selectedRoom && (
        <div className="sports-lightbox">
          <div className="sports-lightbox-content">
            <button 
              className="sports-lightbox-close"
              onClick={() => setShowLightbox(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="sports-lightbox-image-container">
              <img 
                src={`https://deploy-back-3.onrender.com/${selectedRoom.images[currentImageIndex]}`} 
                alt={selectedRoom.name}
                className="sports-lightbox-image"
              />
              
              <button 
                className="sports-lightbox-arrow sports-lightbox-prev"
                onClick={handlePrev}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              
              <button 
                className="sports-lightbox-arrow sports-lightbox-next"
                onClick={handleNext}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              
              <div className="sports-lightbox-index">
                {currentImageIndex + 1} / {selectedRoom.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapyRooms;