import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SportsRooms.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Configuration Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm5lZnppIiwiYSI6ImNtYjQ3azczNDFrdjkyanIwdm9mZHpjYW0ifQ.oM5jT9V4AYqjDYfZpY3Csw';

const TherapyRooms = () => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Charger les salles depuis le backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) throw new Error('Erreur lors du chargement des salles');
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Initialiser la carte avec les salles
  useEffect(() => {
    if (!mapContainer.current || rooms.length === 0) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10, 34.5],
      zoom: 5
    });

    // Ajouter des marqueurs pour chaque salle
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
  }, [rooms]);

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

  if (loading) {
    return <div className="text-center py-5">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mx-auto my-5" style={{ maxWidth: '500px' }}>{error}</div>;
  }

  return (
    <div className="sports-facilities-container" style={{ marginTop: '85px' }}>
      {/* Hero Banner */}
      <section className="sports-banner">
        <div className="sports-banner-overlay">
          <div className="container">
            <div>
              <h3 className="sports-banner-title text-center fw-bold">Our Partners for a Healthy Body and Peaceful Mind</h3>
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
                placeholder="Rechercher des salles..."
                aria-label="Search"
              />
            </div>
            <div className="col-md-2">
              <select className="form-select border-dark rounded-5">
                <option value="">Filtrer par...</option>
                <option value="sport">Type de sport</option>
                <option value="price">Fourchette de prix</option>
                <option value="rating">Évaluation</option>
              </select>
            </div>
          </div>
          
          <div className="row g-4 sports-rooms-grid">
            {rooms.map((room) => (
              <div key={room._id} className="col-md-6 col-lg-4 col-xl-3">
                <article className="sports-room-card rounded-5">
                  <div className="sports-room-image-container">
                    <Carousel indicators={false} controls={false} interval={null}>
                      {room.images.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img 
                            src={`http://localhost:5000/${img}`} 
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
                        {room.activities.map((activity, index) => (
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
            ))}
          </div>
        </div>
        
        <div className='container mt-5'>
          <h1 className='text-center mt-5 mb-5 text-black fw-bolder'>Trouvez des événements exclusifs à proximité</h1>
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
                src={`http://localhost:5000/${selectedRoom.images[currentImageIndex]}`} 
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