import React from 'react';
import './SolidarityPage.css'; // Create this CSS file
import apropos from "../assets/apropos.png";

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="heroo-section py-5 mt-5">
        <div className="container mt-5 mb-5">
          <h1 className="display-6 fw-bolder text-black mb-4 text-center">
            Parce que prendre soin de sa santé mentale est un droit, pas un privilège.
          </h1>
</div>
          <div className="container-fluid px-0 mt-4 mb-4">
            <img 
              src= {apropos}
              alt="Mental health support" 
              className="w-100"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>
<div>
          <p className="fs-3 text-black text-center container mt-5 mb-0">
            Solidarity est une plateforme de santé mentale pensée pour répondre aux besoins des enfants et des jeunes confrontés à des difficultés psychologiques, émotionnelles ou sociales. Notre mission est simple : créer un espace sûr, bienveillant et accessible, où chacun peut trouver écoute, accompagnement et solutions.
          </p>
          <p className="fs-3 text-black text-center container">
            Dans un monde où la santé mentale est encore trop souvent stigmatisée, nous avons choisi d’agir avec compassion, innovation et solidarité.
          </p>
        </div>
      </section>

 {/* New Split Container Section */}
 <section className="split-section py-5 mb-5">
    <div className="container">
      <div className="row g-5">
        {/* Left Blue Card */}
        <div className="col-md-6  text-white">
          <div className="blue-card p-4 h-100" style={{backgroundColor: '#41A3DF', borderRadius: '33px'}}>
            <h3 className="mb-4 fw-bold fs-2 mx-3">Ce que nous faisons :</h3>
            <ul className="list-unstyled fs-5">
              <li className="mb-1">Mise en relation avec des psychologues, thérapeutes et coachs qualifiés</li>
              <li className="mb-1">Réservation de consultations facilement, sans déplacement</li>
              <li className="mb-1">Accès à une communauté d’écoute et de partage</li>
              <li className="mb-1">Blog éducatif pour sensibiliser, informer et prévenir</li>
              <li>Activités sportives et bien-être pour libérer les tensions et renforcer l’estime de soi</li>
            </ul>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="col-md-6 ">
          {/* Pink Values Card */}
          <div className="pink-card mb-4 p-4 text-white " style={{backgroundColor: '#FC20E1', borderRadius: '33px'}}>
            <h3 className="mb-4 fw-bold fs-2 mx-3">Nos valeurs :</h3>
            <ul className="list-unstyled fs-5">
              <li className="mb-1">Écoute active : chaque parole compte</li>
              <li className="mb-1">Respect et confidentialité : la confiance est au cœur du soin</li>
              <li className="mb-1">Accessibilité : parce que tout le monde mérite d’être soutenu</li>
              <li>Soutien global : esprit, corps, émotions… tout est lié</li>
            </ul>
          </div>

          {/* Yellow Vision Card */}
          <div className="yellow-card p-4" style={{backgroundColor: '#FFD940', borderRadius: '33px'}}>
            <h3 className="fw-bolder fs-2 mx-3">Notre vision :</h3>
            <p className="mb-0 mt-2 fs-5 mx-3">Améliorer l’accès aux soins de santé mentale de manière simple et inclusive.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

  );
};

export default AboutPage;