import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SportsRooms.css';
import i1 from "../assets/1.png";
import i2 from "../assets/2.png";
import i3 from "../assets/3.png";
import i4 from "../assets/4.png";
import i5 from "../assets/5.png";
import i6 from "../assets/6.png";
import i7 from "../assets/7.png";
import i8 from "../assets/8.png";
import i13 from "../assets/i13.jpeg";
import i12 from "../assets/i12.jpeg";
import i14 from "../assets/i14.jpeg";
import i20 from "../assets/i20.jpeg";

import MapboxMap from"./MapboxMap";
const TherapyRooms = () => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const rooms = [
    {
      id: 1,
      name: "Espace sassi sport",
      images: [i20, i12, i13, i14],
      address: "Manouba tunis ",
      activities: [
        { name: "football match", day: "Lundi-Vendredi" },
        { name: "Yoga ", day: "Mardi/Jeudi" },
        { name: "football match", day: "Mercredi" }
      ],
      description: "Espace Sassi Sport est un centre sportif moderne et polyvalent, conçu pour accueillir un large public désireux de pratiquer une activité physique dans un cadre convivial et bien équipé"
    },
    {
      id: 2,
      name: "Rollo space",
      images: [i2, i2, i3, i4],
      address: "Bardo, street  hbib bourgiba",
      activities: [
        { name: "Course à pied", day: "Quotidien" },
        { name: "Cyclisme Indoor", day: "Lundi/Mercredi" },
        { name: "Circuit Training", day: "Vendredi" }
      ],
      description: "ollo Space est un espace innovant et dynamique dédié à la glisse urbaine et au divertissement."
    },
    {
      id: 3,
      name: "Mind calm aouina",
      images: [i3, i2, i3, i4],
      address: "Laouina, 14 street  salema ",
      activities: [
        { name: "Yoga", day: "Lundi/Mercredi" },
        { name: "Zumba", day: "Mardi/Jeudi" },
        { name: "Pilates", day: "Vendredi" }
      ],
      description: "Mind Calm Aouina est un centre de bien-être et de développement personnel situé à Laouina, dédié à la détente du corps et de l’esprit."
    },
    {
      id: 4,
      name: "Sami Nefzi space ",
      images: [i4, i2, i3, i4],
      address: "Manouba , tunis",
      activities: [
        { name: "Stretching", day: "Tous les jours" },
        { name: "Mobilité Articulaire", day: "Lundi/Vendredi" },
        { name: "Relaxation", day: "Week-end" }
      ],
      description: "Sami Nefzi Space est un espace artistique et culturel unique dédié à la création contemporaine, à l’expression libre et à l’innovation visuelle."
    },
    {
      id: 5,
      name: "Your space bardo",
      images: [i5, i2, i3, i4],
      address: "O489+3XP,  Road, Tunis",
      activities: [
        { name: "Stretching", day: "Tous les jours" },
        { name: "Mobilité Articulaire", day: "Lundi/Vendredi" },
        { name: "Relaxation", day: "Week-end" }
      ],
      description: "Your Space Bardo est un centre moderne et polyvalent situé au cœur du Bardo, conçu pour vous offrir un lieu de détente, de remise en forme et de développement personnel."
    },
    {
      id: 6,
      name: "Lborak tunis",
      images: [i6, i2, i3, i4],
      address: "Bardo , street amal",
      activities: [
        { name: "Stretching", day: "Tous les jours" },
        { name: "Mobilité Articulaire", day: "Lundi/Vendredi" },
        { name: "Relaxation", day: "Week-end" }
      ],
      description: "Lborak Tunis est un espace dynamique dédié aux sports mécaniques, à la culture urbaine et à l’aventure."
    },
    {
      id: 7,
      name: "Espaci nasri ",
      images: [i7, i2, i3, i4],
      address: "El agba, street khayr edin",
      activities: [
        { name: "Stretching", day: "Tous les jours" },
        { name: "Mobilité Articulaire", day: "Lundi/Vendredi" },
        { name: "Relaxation", day: "Week-end" }
      ],
      description: "Espaci Nasri est un lieu polyvalent dédié à l’art, au design et à l’expression contemporaine."
    },
    {
      id: 8,
      name: "Espace Étirement",
      images: [i8, i2, i3, i4],
      address: "Menzah 6, street matouk",
      activities: [
        { name: "Stretching", day: "Tous les jours" },
        { name: "Mobilité Articulaire", day: "Lundi/Vendredi" },
        { name: "Relaxation", day: "Week-end" }
      ],
      description: "Espace Étirement est un lieu dédié au bien-être, à la mobilité et à la relaxation."
    }
  ];

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
      {/* Empty 3 columns */}
      <div className="col-md-3"></div>
      
      {/* Search Bar - 4 columns */}
      <div className="col-md-4">
        <input
          type="search"
          className="form-control border-dark rounded-5"
          placeholder="Search sports rooms..."
          aria-label="Search"
        />
      </div>

      {/* Filter Dropdown - 2 columns */}
      <div className="col-md-2">
        <select className="form-select border-dark rounded-5">
          <option value="">Filter by...</option>
          <option value="sport">Sport Type</option>
          <option value="price">Price Range</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      
      {/* Remaining 3 columns stay empty */}
    </div>
          <div className="row g-4 sports-rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="col-md-6 col-lg-4 col-xl-3">
                <article className="sports-room-card rounded-5">
                  <div className="sports-room-image-container">
                    <Carousel 
                      indicators={false} 
                      controls={false} 
                      interval={null}
                      pause={false}
                    >
                      {room.images.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img 
                            src={img} 
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
                    
                    {/* Activities Section */}
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
          <h1 className='text-center mt-5 mb-5 text-black fw-bolder'> Find exclusive events nearby</h1>
        <MapboxMap></MapboxMap>
        </div>

        
      </main>

      {/* Custom Lightbox */}
      {showLightbox && (
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