import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LockFill } from 'react-bootstrap-icons';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const token = searchParams.get('token');
      if (!token) {
        throw new Error('Lien de réinitialisation invalide');
      }

      await axios.post('http://localhost:5000/api/admin/change-password', {
        token,
        newPassword
      });

      setSuccessMessage('Mot de passe modifié avec succès !');
      setTimeout(() => navigate('/adminsignin'), 3000);
    } catch (err) {
      let errorMessage = 'Erreur lors de la réinitialisation';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container reset-password-container" style={{ marginTop: '175px' }}
>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Nouveau mot de passe admin</h3>
              <p className="text-muted text-center mb-4">
                Entrez votre nouveau mot de passe (12 caractères minimum)
              </p>

              {(error || successMessage) && (
                <div 
                  className={`alert ${successMessage ? 'alert-success' : 'alert-danger'} text-center`}
                  role="alert"
                >
                  {successMessage || error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label visually-hidden">
                    Nouveau mot de passe
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <LockFill />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder="Nouveau mot de passe"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength="12"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label visually-hidden">
                    Confirmation du mot de passe
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <LockFill />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirmation du mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength="12"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                </button>

                <div className="text-center mt-3">
                  <Link to="/adminsignin" className="text-decoration-none">
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;