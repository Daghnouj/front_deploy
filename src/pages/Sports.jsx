import React, { useState, useRef, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Données statiques des salles en Tunisie avec 4 images chacune
  const rooms = [
    {
      _id: "1",
      name: "Centre Yoga Tunis",
      address: "Avenue Habib Bourguiba, Tunis",
      city: "Tunis",
      description: "Centre de yoga offrant des cours de Hatha, Vinyasa et Yin Yoga dans un cadre paisible au cœur de la capitale.",
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
      ],
      activities: [
        { name: "Yoga Vinyasa", day: "Lundi/Jeudi" },
        { name: "Méditation", day: "Mardi/Vendredi" }
      ],
      coordinates: "36.8065,10.1815",
      website: "https://www.yogatunis.tn"
    },
    {
      _id: "2",
      name: "Zen Sousse",
      address: "Rue El Hedi Chaker, Sousse",
      city: "Sousse",
      description: "Espace dédié au bien-être avec des programmes de méditation, yoga et thérapies alternatives face à la mer.",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
      ],
      activities: [
        { name: "Méditation Pleine Conscience", day: "Lundi/Mercredi" },
        { name: "Yin Yoga", day: "Samedi" }
      ],
      coordinates: "35.8254,10.6084",
      website: "https://www.zensousse.tn"
    },
    {
      _id: "3",
      name: "Pilates Hammamet",
      address: "Zone Touristique, Hammamet",
      city: "Hammamet",
      description: "Studio de Pilates avec instructeurs certifiés et équipements modernes dans un cadre luxueux.",
      images: [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
      ],
      activities: [
        { name: "Pilates Reformer", day: "Mardi/Jeudi" },
        { name: "Pilates Doux", day: "Lundi/Vendredi" }
      ],
      coordinates: "36.4000,10.6167",
      website: "https://www.pilateshammamet.com"
    },
    {
      _id: "4",
      name: "Espace Méditation Djerba",
      address: "Zone Midoun, Djerba",
      city: "Djerba",
      description: "Havre de paix pour la méditation et le développement personnel dans l'île enchantée de Djerba.",
      images: [
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
      ],
      activities: [
        { name: "Méditation Guidée", day: "Mercredi/Samedi" },
        { name: "Retraites Spirituelles", day: "Dimanche" }
      ],
      coordinates: "33.8080,10.8578",
      website: "https://www.meditationdjerba.tn"
    },
    {
      _id: "5",
      name: "Centre Taï Chi Sfax",
      address: "Avenue de la République, Sfax",
      city: "Sfax",
      description: "Découvrez l'art martial chinois du Taï Chi dans un espace traditionnel avec maîtres expérimentés.",
      images: [
        "https://images.unsplash.com/photo-1627483297924-9158a5f12a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
      ],
      activities: [
        { name: "Taï Chi Traditionnel", day: "Lundi/Jeudi" },
        { name: "Qi Gong", day: "Mardi/Vendredi" }
      ],
      coordinates: "34.7406,10.7603",
      website: "https://www.taichisfax.com"
    },
    {
      _id: "6",
      name: "Oasis Yoga Tozeur",
      address: "Palmeraie, Tozeur",
      city: "Tozeur",
      description: "Pratiquez le yoga dans une authentique oasis du désert tunisien, entouré de palmiers et de calme.",
      images: [
        "https://images.unsplash.com/photo-1593164842264-854604db2260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
        "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
      ],
      activities: [
        { name: "Yoga du Désert", day: "Tous les jours" },
        { name: "Méditation au Coucher du Soleil", day: "Vendredi" }
      ],
      coordinates: "33.9197,8.1335",
      website: "https://www.oasisyogatozeur.tn"
    }
  ];

  // Liste des villes uniques pour le filtre
  const cities = [...new Set(rooms.map(room => room.city))];

  // Initialisation de la carte centrée sur la Tunisie
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [9.5375, 33.8869], // Centre sur la Tunisie
      zoom: 6
    });

    map.current.on('load', () => {
      rooms.forEach(room => {
        if (!room.coordinates) return;
        
        const [lat, lng] = room.coordinates.split(',').map(Number);
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setText(room.name))
          .addTo(map.current);
      });
    });

    return () => map.current?.remove();
  }, []);

  // Filtrage des salles avec critères multiples
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.activities.some(activity => 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCity = selectedCity === '' || room.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

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

  return (
    <div className="sports-facilities-container" style={{ marginTop: '85px' }}>
      {/* Bannière */}
      <section className="sports-banner">
        <div className="sports-banner-overlay">
          <div className="container">
            <h3 className="sports-banner-title text-center fw-bold">
              Our wellness centers in Tunisia
            </h3>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="sports-main-content">
        <div className="container">
          <div className="row mb-4 justify-content-center"> 
            <div className="col-md-5">
              <input
                type="search"
                className="form-control border-dark rounded-5"
                placeholder="Search by name, address or activity..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select border-dark rounded-5"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All cities
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Grille des salles */}
          <div className="row g-4 sports-rooms-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div key={room._id} className="col-md-6 col-lg-4">
                  <article className="sports-room-card rounded-5">
                    <div className="sports-room-image-container">
                      <Carousel indicators={false} controls={false} interval={null}>
                        {room.images.map((img, index) => (
                          <Carousel.Item key={index}>
                            <img 
                              src={img}
                              alt={`${room.name} ${index + 1}`}
                              className="sports-room-image"
                              onClick={() => handleImageClick(room, index)}
                              role="button"
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                    <div className="sports-room-info">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3 className="sports-room-name">{room.name}</h3>
                        <span className="badge bg-primary rounded-pill">{room.city}</span>
                      </div>
                      
                      <div className="sports-room-address mb-2">
                        <i className="bi bi-geo-alt sports-address-icon"></i>
                        <span>{room.address}</span>
                      </div>
                      
                      <div className="sports-room-activities mb-3">
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
                      
                      <div className="sports-room-website mt-2">
                        <i className="bi bi-globe me-2"></i>
                        <a 
                          href={room.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary fw-medium"
                        >
                          Visiter le site web
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <h4 className="d-inline">Aucun centre ne correspond à votre recherche</h4>
                </div>
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Carte */}
        <div className='container mt-5'>
          <h1 className='text-center mt-5 mb-5 text-black fw-bolder'>Centres de bien-être en Tunisie</h1>
          <div ref={mapContainer} style={{ height: '500px', width: '100%', borderRadius: '15px' }} />
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
                src={selectedRoom.images[currentImageIndex]}
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