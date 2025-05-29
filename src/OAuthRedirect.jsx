import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      // Redirection selon le rôle si nécessaire
      navigate(role === "professional" ? "/" : "/", { replace: true });
    } else {
      navigate("/login", { state: { error: "Échec de l'authentification OAuth" }, replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
};

export default OAuthRedirect;