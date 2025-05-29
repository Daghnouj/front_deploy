import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import './Subscription.css';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);

  const PLANS = [
    {
      id: 'monthly',
      name: 'Mensuel',
      price: 29,
      features: ['Accès complet', 'Support 24/7', 'Analytique avancée'],
      recommended: false
    },
    {
      id: 'yearly',
      name: 'Annuel',
      price: 299,
      features: ['Économisez 15%', 'Certification incluse', 'Support premium'],
      recommended: true
    }
  ];
  
const handleSubscribe = async (plan) => {
  setSessionLoading(true);
  setError('');

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/subscriptions/create-session`,
      { plan: plan.id },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    // Chargement correct de Stripe
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    
    if (!stripe) {
      throw new Error('Échec du chargement de Stripe');
    }

    // Redirection avec le format correct
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (error) {
      throw new Error(error.message || 'Erreur de redirection Stripe');
    }

  } catch (err) {
    setError(err.response?.data?.error || err.message);
    console.error('Erreur de paiement:', {
      message: err.message,
      stack: err.stack,
      sessionId: data?.sessionId
    });
  } finally {
    setSessionLoading(false);
  }
};

  return (
    <div className="subscription-container">
      <div className="header">
        <h1>Choisissez Votre Abonnement</h1>
        <p>Sélectionnez le plan qui correspond le mieux à vos besoins</p>
      </div>

      <div className="plans-grid">
        {PLANS.map(plan => (
          <div 
            key={plan.id}
            className={`plan-card ${plan.recommended ? 'recommended' : ''}`}
          >
            {plan.recommended && <div className="recommended-badge">Populaire</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.price}€<span>/{plan.id === 'monthly' ? 'mois' : 'an'}</span>
            </div>
            
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <svg className="check-icon" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe(plan)}
              disabled={sessionLoading}
              className="subscribe-button"
            >
              {sessionLoading ? 'Chargement...' : 'Choisir ce plan'}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="error-message">
          <svg className="warning-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>
      )}

      <div className="security-info">
        <div className="security-content">
          <svg className="lock-icon" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span>Paiements 100% sécurisés - Cryptage SSL/TLS</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;