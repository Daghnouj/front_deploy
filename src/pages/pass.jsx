import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import forgotPasswordImage from "../assets/login4.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userId, setUserId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/password/forgot-password", { email });
      setUserId(response.data.id);
      setStep(2);
      setTimeLeft(600);
      setMessage({ text: "Un code OTP a été envoyé à votre adresse email", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Erreur lors de l'envoi de l'OTP", type: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/password/verify-otp/${userId}`, { otp });
      setStep(3);
      setMessage({ text: "Code OTP vérifié avec succès", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Code OTP invalide ou expiré", type: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Les mots de passe ne correspondent pas", type: "danger" });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/password/change-password/${userId}`, { newPassword ,confirmPassword});
      setMessage({ text: "Mot de passe réinitialisé avec succès ! Redirection...", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Erreur lors de la réinitialisation", type: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Image Section - Matches Login Design */}
        <div className="col-md-8 d-none d-md-block p-0 position-relative">
          <div 
            className="h-100 w-100 bg-cover"
            style={{
              backgroundImage: `url(${forgotPasswordImage})`,
              backgroundPosition: "center center"
            }}
          />
        </div>

        {/* Form Section - Matching Login Styling */}
        <div className="col-md-4 d-flex align-items-center justify-content-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-85 px-4"
          >
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3 text-start" style={{ color: "#2563eb" }}>
                {step === 1 && 'Réinitialisation du mot de passe'}
                {step === 2 && 'Vérification OTP'}
                {step === 3 && 'Nouveau mot de passe'}
              </h2>
              <p className="text-muted text-start">
                {step === 1 && 'Entrez votre email pour commencer la réinitialisation'}
                {step === 2 && 'Vérifiez votre email et entrez le code OTP'}
                {step === 3 && 'Définissez votre nouveau mot de passe'}
              </p>
            </div>

            {message.text && (
              <div className={`alert alert-${message.type} mb-4`}>
                {message.text}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSubmitEmail}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control border-2 py-2 rounded-5"
                    id="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderColor: "#e2e8f0" }}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn w-100 py-2 mb-3 text-white fw-medium rounded-5"
                  style={{ 
                    backgroundColor: "#FC20E1",
                    border: "none"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer l'OTP"}
                </motion.button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitOtp}>
                <div className="mb-4">
                  <label htmlFor="otp" className="form-label fw-medium">
                    Code OTP <span className="text-muted">(Expire dans {formatTime(timeLeft)})</span>
                  </label>
                  <input
                    type="text"
                    className="form-control border-2 py-2 rounded-5"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Entrez les 6 chiffres"
                    style={{ borderColor: "#e2e8f0" }}
                    inputMode="numeric"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn w-100 py-2 mb-3 text-white fw-medium rounded-5"
                  style={{ 
                    backgroundColor: "#FC20E1",
                    border: "none"
                  }}
                  disabled={isLoading}
                >
                  Vérifier l'OTP
                </motion.button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmitNewPassword}>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="form-label fw-medium">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control border-2 py-2 rounded-5"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ borderColor: "#e2e8f0" }}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-medium">Confirmation</label>
                  <input
                    type="password"
                    className="form-control border-2 py-2 rounded-5"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ borderColor: "#e2e8f0" }}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn w-100 py-2 mb-3 text-white fw-medium rounded-5"
                  style={{ 
                    backgroundColor: "#FC20E1",
                    border: "none"
                  }}
                  disabled={isLoading}
                >
                  Réinitialiser
                </motion.button>
              </form>
            )}

            <div className="text-center mt-4">
              <Link 
                to="/login" 
                className="text-decoration-none fw-medium"
                style={{ color: "#2563eb" }}
              >
                ← Retour à la connexion
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;