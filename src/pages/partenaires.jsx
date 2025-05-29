// frontend/src/components/PartenairesPage.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PartenairesPage = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    // Fetch partners from your backend
    const fetchPartners = async () => {
      try {
        const response = await fetch('https://deploy-back-3.onrender.com/api/partenaires');
        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="partners-page" style={{ fontFamily: 'Poppins, sans-serif', color: '#2b2d42' }}>
      {/* Hero Section */}
      <section
        className="hero-section text-center text-white d-flex align-items-center"
        style={{ height: '60vh', background: 'linear-gradient(to right, #1a73e8, #4e54c8)' }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold">Nos Partenaires</h1>
          <p className="lead">Découvrez les organisations qui nous accompagnent dans notre mission.</p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#1a73e8' }}>Ils nous font confiance</h2>
          <div className="row justify-content-center">
            {partners.map((partner) => (
              <div key={partner._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className="card border-0 shadow-lg text-center"
                  style={{ borderRadius: '20px', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <img
                    src={`https://deploy-back-3.onrender.com/uploads/${partner.logo}`}
                    alt={partner.nom}
                    className="card-img-top"
                    style={{ padding: '20px', borderRadius: '20px' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{partner.nom}</h5>
                    <p>{partner.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartenairesPage;
