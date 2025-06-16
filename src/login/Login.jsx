import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import login from "../assets/login4.jpeg";
import ReactivateModal from "./ReactivateModal";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", mdp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const recaptchaRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!recaptchaToken) {
      setError("Veuillez vérifier que vous n'êtes pas un robot");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://deploy-back-3.onrender.com/api/auth/login",
        { ...formData, recaptchaToken }
      );
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      navigate("/", { replace: true });

    } catch (err) {
      if (err.response?.data?.canReactivate) {
        setShowReactivateModal(true);
      } else {
        setError(err.response?.data?.message || "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReactivation = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Réinitialiser le ReCAPTCHA et attendre une nouvelle vérification
      recaptchaRef.current.reset();
      setRecaptchaToken("");

      // Attendre la nouvelle vérification
      const newRecaptchaToken = await new Promise((resolve) => {
        const checkToken = setInterval(() => {
          if (recaptchaToken) {
            clearInterval(checkToken);
            resolve(recaptchaToken);
          }
        }, 100);
      });

      const response = await axios.post(
        "https://deploy-back-3.onrender.com/api/auth/login",
        { 
          ...formData,
          recaptchaToken: newRecaptchaToken,
          reactivate: true 
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      setShowReactivateModal(false);
      navigate("/", { replace: true });

    } catch (error) {
      console.error("Erreur de réactivation:", error);
      setError(error.response?.data?.message || "Échec de la réactivation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReactivation = () => {
    recaptchaRef.current.reset();
    setRecaptchaToken("");
    setShowReactivateModal(false);
  };
  
  const handleOAuthRedirect = (provider) => {
    window.location.href = `https://deploy-back-3.onrender.com/auth/${provider}`;
  };

  return (
    <div className="container-fluid vh-100">
      <ReactivateModal
        isOpen={showReactivateModal}
        onConfirm={handleReactivation}
        onCancel={handleCancelReactivation}
        loading={loading}
      />

      <div className="row h-100">
        <div className="col-md-8 d-none d-md-block p-0 position-relative">
          <div 
            className="h-100 w-100 bg-cover"
            style={{
              backgroundImage: `url(${login})`,
              backgroundPosition: "center center"
            }}
          ></div>
        </div>

        <div className="col-md-4 d-flex align-items-center justify-content-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-85 px-4"
          >
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3 text-start" style={{ color: "#2563eb" }}>Bienvenue !</h2>
              <p className="text-muted text-start">Entrez vos informations pour continuer</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className="form-control border-2 py-2 rounded-5"
                  id="email"
                  placeholder="exemple@email.com"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="mdp" className="form-label fw-medium ">Mot de passe</label>
                <input
                  type="password"
                  className="form-control border-2 py-2 rounded-5"
                  id="mdp"
                  placeholder="••••••••"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              <div className="d-flex align-items-center justify-content-between mb-4 gap-3">
                <div className="form-check m-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    style={{ accentColor: "#2563eb" }}
                  />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">
                    Se souvenir de moi
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-decoration-none fw-medium flex-shrink-0"
                  style={{ color: "#2563eb" }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <div className="mb-4" style={{ display: "flex", justifyContent: "center" }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6Lf08GIrAAAAAGl0nhrD4WWFufBAVjnA_-xcCOhD"
                  onChange={handleRecaptchaChange}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn w-100 py-2 mb-3 text-white fw-medium rounded-5"
                style={{ 
                  backgroundColor: "#FC20E1",
                  border: "none",
                }}
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </motion.button>
            </form>

            <div className="text-center my-4 position-relative">
              <hr className="border-1" style={{ borderColor: "#e2e8f0" }} />
              <span 
                className="position-absolute bg-white px-3 text-muted"
                style={{ 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)",
                  fontSize: "0.9rem"
                }}
              >
                OU CONTINUER AVEC
              </span>
            </div>

            <div className="d-flex gap-3 justify-content-center mb-4">
              <button
                onClick={() => handleOAuthRedirect("google")}
                className="btn btn-outline d-flex align-items-center gap-2 px-4 py-2 rounded-5"
                style={{ 
                  borderColor: "#000000",
                  color: "#000000",
                }}
              >
                <FaGoogle className="fs-5" style={{ color: "#000000" }} /> 
                Google
              </button>
              
              <button
                onClick={() => handleOAuthRedirect("facebook")}
                className="btn btn-outline d-flex align-items-center gap-2 px-4 py-2 rounded-5"
                style={{ 
                  borderColor: "#000000",
                  color: "#000000",
                }}
              >
                <FaFacebook className="fs-5" style={{ color: "#000000" }} /> 
                Facebook
              </button>
            </div>

            <p className="text-center text-muted mt-4">
              Pas encore membre ?{" "}
              <Link 
                to="/signup" 
                className="fw-bold text-decoration-none"
                style={{ color: "#2563eb" }}
              >
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;