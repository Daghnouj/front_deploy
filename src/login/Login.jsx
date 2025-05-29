import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import login from "../assets/login4.jpeg";
import ReactivateModal from "./ReactivateModal";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", mdp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://deploy-back-3.onrender.com/api/auth/login",
        formData
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
      setIsSubmitting(false);
    }
  };

  const handleReactivation = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        "https://deploy-back-3.onrender.com/api/auth/login",
        { 
          ...formData,
          reactivate: true 
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      setShowReactivateModal(false);
      navigate("/", { replace: true });

    } catch (error) {
      setError(error.response?.data?.message || "Échec de la réactivation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReactivation = () => {
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
        <div className="col-md-8 d-none d-md-block p-0 position-relative overflow-hidden">
          <motion.div
            className="h-100 w-100"
            style={{
              backgroundImage: `url(${login})`,
              backgroundPosition: "center center",
              backgroundSize: "cover"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="col-md-4 d-flex align-items-center justify-content-center bg-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-85 px-4 py-5"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-5"
            >
              <h2 className="fw-bold mb-3 text-start" style={{ color: "#2563eb" }}>Bienvenue !</h2>
              <p className="text-muted text-start">Entrez vos informations pour continuer</p>
            </motion.div>

            {error && (
              <motion.div 
                className="alert alert-danger"
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: "auto" 
                }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-3"
              >
                <label htmlFor="email" className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className="form-control border-2 py-2 rounded-5"
                  id="email"
                  placeholder="exemple@email.com"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-4"
              >
                <label htmlFor="mdp" className="form-label fw-medium ">Mot de passe</label>
                <input
                  type="password"
                  className="form-control border-2 py-2 rounded-5"
                  id="mdp"
                  placeholder="••••••••"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="d-flex align-items-center justify-content-between mb-4 gap-3"
              >
                <div className="form-check m-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    style={{ accentColor: "#2563eb" }}
                    disabled={loading}
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
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn w-100 py-2 mb-3 text-white fw-medium rounded-5 d-flex justify-content-center align-items-center"
                style={{ 
                  backgroundColor: "#FC20E1",
                  border: "none",
                  minHeight: "45px"
                }}
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Connexion en cours...
                  </>
                ) : "Se connecter"}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-center my-4 position-relative"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="d-flex gap-3 justify-content-center mb-4"
            >
              <button
                onClick={() => handleOAuthRedirect("google")}
                className="btn btn-outline d-flex align-items-center gap-2 px-4 py-2 rounded-5"
                style={{ 
                  borderColor: "#000000",
                  color: "#000000",
                }}
                disabled={loading}
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
                disabled={loading}
              >
                <FaFacebook className="fs-5" style={{ color: "#000000" }} /> 
                Facebook
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-muted mt-4"
            >
              Pas encore membre ?{" "}
              <Link 
                to="/signup" 
                className="fw-bold text-decoration-none"
                style={{ color: "#2563eb" }}
              >
                Créer un compte
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;