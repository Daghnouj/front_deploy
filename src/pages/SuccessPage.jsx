import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Subscription.css';

const PLANS = [
  { id: 'monthly', name: 'Mensuel', price: 29 },
  { id: 'yearly', name: 'Annuel', price: 299 }
];

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          throw new Error('Aucun identifiant de session trouvé dans l\'URL');
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/subscriptions/session-status`,
          {
            params: { session_id: sessionId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!data?.status || data.status.toLowerCase() !== 'paid') {
          throw new Error('Confirmation de paiement incomplète');
        }

        setSessionData(data);
        
        // Countdown for redirection
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              navigate('/subscription');
              return 0;
            }
            return prev - 1;
          });
        }, 5000);

        return () => clearInterval(interval);

      } catch (err) {
        const errorMessage = err.response?.data?.error 
          || err.message 
          || 'Erreur lors de la confirmation du paiement';
        
        setError(errorMessage);
        console.error('Erreur de vérification:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const currentPlan = PLANS.find(p => p.id === sessionData?.plan);

  return (
    <div className="subscription-container">
      {loading ? (
        <div className="loading-screen">
          <div className="spinner dual-ring"></div>
          <p>Finalisation de votre abonnement...</p>
        </div>
      ) : error ? (
        <div className="error-message card">
          <div className="icon-wrapper">
            <svg className="warning-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3>Confirmation en attente</h3>
          <p className="error-text">{error}</p>
          <div className="action-buttons">
            <button 
              className="btn btnk retry-button"
              onClick={() => window.location.reload()}
            >
              Actualiser la page
            </button>
            <a href="/support" className="btn btnk support-link">
              Contacter le support
            </a>
          </div>
        </div>
      ) : (
        <div className="success-screen card">
          <div className="icon-wrapper success">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="success-title">Abonnement Activé ! 🎉</h2>
          <div className="success-details-box">
            <div className="detail-grid">
              <div className="detail-item">
                <span>Type d'abonnement:</span>
                <strong>{currentPlan?.name}</strong>
              </div>
              <div className="detail-item">
                <span>Montant:</span>
                <strong>{currentPlan?.price}€</strong>
              </div>
              <div className="detail-item">
                <span>Email:</span>
                <strong>{sessionData?.customer_email || 'N/A'}</strong>
              </div>
              <div className="detail-item">
                <span>Prochain renouvellement:</span>
                <strong>
                  {new Date(sessionData?.current_period_end * 1000).toLocaleDateString()}
                </strong>
              </div>
            </div>
            <div className="status-badge confirmed">
              <svg viewBox="0 0 24 24" className="badge-icon">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Paiement Confirmé
            </div>
          </div>
          <div className="redirect-notice">
            <p>Redirection vers l'accueil dans {countdown}s...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(5 - countdown) * 20}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;