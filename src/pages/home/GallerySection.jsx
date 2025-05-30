import React from "react";
import { Link } from "react-router-dom";
import "./GallerySection.css";
import galerie from "../../assets/galerie.png";

const GallerySection = () => {
  return (
    <div className="gallery-section container-fluid bgg py-5 d-flex flex-column align-items-center">
      <div className="container text-center mt-3">
        <h2 className="mb-5 text-white txt">Explore our Gallery</h2>
        <div className="gallery-container position-relative d-inline-block">
          <img src={galerie} alt="Gallery" className="gallery-image img-fluid mt-3 rounded" />
          <Link to="/galerie" className="gallery-button position-absolute text-white text-decoration-none">
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
