import React from "react";
import "./ServicesSection.css";
import { Link } from "react-router-dom";
import g11 from "../../assets/g11.png";
import g12 from "../../assets/g12.png";
import g13 from "../../assets/g13.png";
import g14 from "../../assets/g14.png";
const ServicesSection = () => {
   return (
    <div className="image-gallery-container mb-5 mt-2">
      <p className="tt mt-4 mb-4 fw-bold"> Why to choose Solidarity </p> 
      <div className="image-grid">
        <div className="image-item">
          <img 
            src={g11} 
            alt="Gallery 1" 
            className="gallery-image"
            loading="lazy"
          />
        </div>
        <div className="image-item">
          <img 
            src={g12}
            alt="Gallery 2" 
            className="gallery-image"
            loading="lazy"
          />
        </div>
        <div className="image-item">
          <img 
            src={g13}
            alt="Gallery 3" 
            className="gallery-image"
            loading="lazy"
          />
        </div>
        <div className="image-item">
          <img 
            src={g14}
            alt="Gallery 4" 
            className="gallery-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};


export default ServicesSection;
