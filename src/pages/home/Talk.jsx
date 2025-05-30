import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Talk.css";
import h6 from "../../assets/h6.png";

const Talk = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleJoinClick = () => {
    navigate("/community"); // Navigate to community route
  };

  return (
    <div className="talk-section">
      <div className="container col-10">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 d-flex flex-column text-start">
            <h2>Let's Talk, Let's Heal</h2>
            <p>
              Join our mental health community and support each other every step of the way.
              Together, we create a space where experiences are respected, voices are heard, 
              and healing begins with a simple message.
            </p>
            {/* Join Now Button with navigation */}
            <button 
              className="talk-book-now-btn mt-3"
              onClick={handleJoinClick}
            >
              Join Now
            </button>
          </div>
          {/* Image Section */}
          <div className="col-lg-6 text-center">
            <img src={h6} alt="Community Support" className="img-fluid rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Talk;