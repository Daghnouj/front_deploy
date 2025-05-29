import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./Demande.css";
import axios from "axios";

const Demandes = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Récupérer les approuvés persistants
  const getPersistedApproved = () => {
    const saved = localStorage.getItem("approvedRequests");
    return saved ? JSON.parse(saved) : [];
  };

  // Sauvegarder les approuvés
  const persistApproved = (requests) => {
    localStorage.setItem("approvedRequests", JSON.stringify(requests));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/booking/therapist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Formater les données API
        const apiRequests = response.data.map(booking => ({
          id: booking._id,
          date: new Date(booking.date).toISOString().split("T")[0],
          time: new Date(booking.date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          nom: booking.nom,
          prenom: booking.prenom,
          email: booking.email,
          phone: booking.phone,
          ville: booking.ville,
          antecedents: booking.antecedentsMedicaux,
          specialite: booking.specialite,
          probleme: booking.probleme,
          status: booking.status,
        }));

        // Combiner avec le localStorage
        const persisted = getPersistedApproved();
        const combined = [...apiRequests, ...persisted];

        // Éliminer les doublons (priorité au localStorage)
        const unique = combined.reduce((acc, current) => {
          if (!acc.find(item => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Mapper les statuts
        setRequests(unique.map(req => ({
          ...req,
          status: req.status === "confirmed" || persisted.some(r => r.id === req.id)
            ? "Approuvé"
            : req.status === "pending"
            ? "En attente"
            : "Rejeté"
        })));

      } catch (error) {
        console.error("Erreur chargement données :", error);
      }
    };

    fetchData();
  }, []);

  const handleShowDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      if (newStatus === "confirmed") {
        const requestToApprove = requests.find(r => r.id === id);
        const updatedApproved = [...getPersistedApproved(), requestToApprove];
        persistApproved(updatedApproved);
      }

      await axios.patch(
        `/api/booking/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { ...req, status: newStatus === "confirmed" ? "Approuvé" : "Rejeté" } 
            : req
        ).filter(req => req.status !== "Rejeté")
      );

    } catch (error) {
      console.error("Erreur mise à jour :", error);
    }
  };

  return (
    <div className="demandes-container">
      <div className="demandes-card">
        <div className="demandes-header">
          <h2 className="demandes-title">Demandes de Rendez-vous</h2>
        </div>

        <div className="demandes-list">
          {requests.length === 0 ? (
            <p className="demandes-empty">Aucune demande en attente.</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className={`demandes-item ${
                  request.status === "Approuvé"
                    ? "approuvé"
                    : request.status === "Rejeté"
                    ? "rejeté"
                    : ""
                }`}
              >
                <div className="demandes-info">
                  <div className="demandes-time">
                    {request.date} - {request.time}
                  </div>
                  <div className="demandes-main-info">
                    <span className="demandes-name">
                      {request.prenom} {request.nom}
                    </span>
                    <div className="demandes-probleme">{request.probleme}</div>
                    <span 
                      className="details-link"
                      onClick={() => handleShowDetails(request)}
                    >
                      Voir détails
                    </span>
                  </div>
                </div>

                <div className="demandes-right-section">
                  <span className={`demandes-status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  
                  {request.status === "En attente" && (
                    <div className="demandes-actions">
                      <button
                        className="demandes-button approve"
                        onClick={() => handleStatusUpdate(request.id, "confirmed")}
                      >
                        Approuver
                      </button>
                      <button
                        className="demandes-button delete"
                        onClick={() => handleStatusUpdate(request.id, "cancelled")}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        {selectedRequest && (
          <div className="demandes-modal-content">
            <div className="demandes-modal-header">
              <h3>{selectedRequest.prenom} {selectedRequest.nom}</h3>
              <button 
                className="demandes-modal-close"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            
            <div className="demandes-modal-body">
              <div className="info-row">
                <span className="info-label">Date/Heure :</span>
                <span>{selectedRequest.date} - {selectedRequest.time}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Spécialité :</span>
                <span>{selectedRequest.specialite}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Contact :</span>
                <span>{selectedRequest.phone} | {selectedRequest.email}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Localisation :</span>
                <span>{selectedRequest.ville}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Antécédents :</span>
                <span>{selectedRequest.antecedents}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Détails :</span>
                <p className="info-details">{selectedRequest.probleme}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Demandes;