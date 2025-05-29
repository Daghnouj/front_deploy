import React from "react";
import "./TherapistSection.css"; // Import the corresponding CSS file
import h2 from "../../assets/h2.png";

const TherapistSection = () => {
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
            {/* Book Now Button */}
            <button className="book-now-btn mt-3">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistSection;
