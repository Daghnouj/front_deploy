import  { useState } from "react";
import "./HeroSection.css";
import h2 from "../../assets/zdzd.png";

const HeroSection = () => {
  const [selectedOption, setSelectedOption] = useState("");
  
  const handleGoClick = () => {
    if (selectedOption) {
      alert(`Requesting ${selectedOption}...`);
    }
  };

  return (
    <div className="container-fluid bg mt-5">
      <div className="container col-10">
        <div className="row align-items-center">
          <div className="col-lg">
            <h1 className="titre">Let’s Walk This Journey Together</h1>
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
                <option value="Doctor Appointment">Réserver </option>
                <option value="Therapist Session">Therapist Session</option>
                <option value="Emergency Help">Emergency Help</option>
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