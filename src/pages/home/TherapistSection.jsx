import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./TherapistSection.css";
import h2 from "../../assets/h2.png";

const TherapistSection = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleConnectClick = () => {
    navigate("/professionals"); // Navigate to professionals route
  };

  return (
    <div className="therapist-section">
      <div className="container col-10">
        <div className="row align-items-center justify-content-center">
          {/* Left Side - Image */}
          <div className="col-lg-6 text-center">
            <img src={h2} alt="Therapist" className="img-fluid rounded" />
          </div>

          {/* Right Side - Centered Text & Button */}
          <div className="col-lg-6 d-flex flex-column text-start">
            <h2>Find the right support for you</h2>
            <p>
              Connect with professional therapists and coaches ready to support your growth, healing, and balance.
            </p>
            {/* Connect Now Button with navigation */}
            <button 
              className="book-now-btn mt-3"
              onClick={handleConnectClick}
            >
              Connect Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistSection;