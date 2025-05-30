import React from 'react';
import './SolidarityPage.css'; // Make sure this CSS file exists
import apropos from "../assets/apropos.png";

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="heroo-section py-5 mt-5">
        <div className="container mt-5 mb-5">
          <h1 className="display-6 fw-bolder text-black mb-4 text-center">
            Because taking care of your mental health is a right, not a privilege.
          </h1>
        </div>
        <div className="container-fluid px-0 mt-4 mb-4">
          <img 
            src={apropos}
            alt="Mental health support" 
            className="w-100"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="fs-3 text-black text-center container mt-5 mb-0">
            Solidarity is a mental health platform designed to meet the needs of children and young people facing psychological, emotional, or social difficulties. Our mission is simple: to create a safe, caring, and accessible space where everyone can find support, guidance, and solutions.
          </p>
          <p className="fs-3 text-black text-center container">
            In a world where mental health is still too often stigmatized, we have chosen to act with compassion, innovation, and solidarity.
          </p>
        </div>
      </section>

      {/* New Split Container Section */}
      <section className="split-section py-5 mb-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Blue Card */}
            <div className="col-md-6 text-white">
              <div className="blue-card p-4 h-100" style={{ backgroundColor: '#41A3DF', borderRadius: '33px' }}>
                <h3 className="mb-4 fw-bold fs-2 mx-3">What we do:</h3>
                <ul className="list-unstyled fs-5">
                  <li className="mb-1">Connecting with qualified psychologists, therapists, and coaches</li>
                  <li className="mb-1">Booking consultations easily, without the need to travel</li>
                  <li className="mb-1">Access to a community for listening and sharing</li>
                  <li className="mb-1">Educational blog to raise awareness, inform, and prevent</li>
                  <li>Sports and wellness activities to release tension and build self-esteem</li>
                </ul>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="col-md-6">
              {/* Pink Values Card */}
              <div className="pink-card mb-4 p-4 text-white" style={{ backgroundColor: '#FC20E1', borderRadius: '33px' }}>
                <h3 className="mb-4 fw-bold fs-2 mx-3">Our values:</h3>
                <ul className="list-unstyled fs-5">
                  <li className="mb-1">Active listening: every word matters</li>
                  <li className="mb-1">Respect and confidentiality: trust is at the heart of care</li>
                  <li className="mb-1">Accessibility: because everyone deserves to be supported</li>
                  <li>Holistic support: mind, body, emotions... everything is connected</li>
                </ul>
              </div>

              {/* Yellow Vision Card */}
              <div className="yellow-card p-4" style={{ backgroundColor: '#FFD940', borderRadius: '33px' }}>
                <h3 className="fw-bolder fs-2 mx-3">Our vision:</h3>
                <p className="mb-0 mt-2 fs-5 mx-3">To improve access to mental health care in a simple and inclusive way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
