import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Appel API vers le backend
        await fetch('https://deploy-back-3.onrender.com/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        // Nettoyage du stockage local et redirection
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/adminsignin');
      }
    };

    performLogout();
  }, [navigate]);

  return <div>Déconnexion en cours...</div>;
};

export default Logout;