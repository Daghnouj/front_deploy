import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";
import h2 from "../../assets/zdzd.png";

const HeroSection = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleGoClick = () => {
    if (selectedOption) {
      navigate(selectedOption);
    }
  };

  // Map dropdown options to routes from your header
  const navigationOptions = [
    { label: "About", value: "/apropos" },
    { label: "Contact", value: "/contact" },
    { label: "Professionals Directory", value: "/professionals" },
    { label: "Book Reservation", value: "/Professionals" },
    { label: "Activities & Centers", value: "/sports" },
    { label: "Community", value: "/community" },
    { label: "Gallery", value: "/galerie" },
  ];

  return (
    <div className="container-fluid bg mt-5">
      <div className="container col-10">
        <div className="row align-items-center">
          <div className="col-lg">
            <h1 className="titre">Let's Walk This Journey Together</h1>
            <p className="para mt-4">
              Your journey to mental and physical wellness starts here. Together, with experts and a caring community, we help you find balance, healing, and strength.
            </p>
            <div className="d-flex align-items-center gap-3 mt-5">
              <select 
                className="help-select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">I would like to...</option>
                {navigationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button 
                className="go-btn"
                onClick={handleGoClick}
                disabled={!selectedOption}
              >
                Go
              </button>
            </div>
          </div>
          <div className="col-lg text-end">
            <img 
              src={h2}
              alt="Healing Image" 
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;