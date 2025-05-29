import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Envelope, Lock, ShieldLock } from 'react-bootstrap-icons';


const paths = {
  signin: '/adminsignin',
};

const ForgotPasswordAdmin = () => {
  // State management
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'otp':
        setOtp(value.replace(/\D/g, ''));
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      switch (step) {
        case 1: {
          const response = await axios.post(
            'http://localhost:5000/api/admin/forgot-password',
            { email }
          );
          setAdminId(response.data.adminId);
          setSuccessMessage('Un email avec un code OTP a été envoyé !');
          setStep(2);
          break;
        }
        case 2: {
          await axios.post('http://localhost:5000/api/admin/verify-otp', {
            adminId,
            otp,
          });
          setSuccessMessage('Code OTP validé avec succès !');
          setStep(3);
          break;
        }
        case 3: {
          if (newPassword !== confirmPassword) {
            throw new Error('Les mots de passe ne correspondent pas');
          }
          await axios.post('http://localhost:5000/api/admin/change-password', {
            adminId,
            newPassword,
          });
          setSuccessMessage('Mot de passe modifié avec succès !');
          setTimeout(() => navigate(paths.signin), 3000);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      let errorMessage = 'Erreur lors de la demande';
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

  const getButtonText = () => {
    if (loading) return 'Traitement en cours...';
    switch (step) {
      case 1:
        return 'Envoyer le code OTP';
      case 2:
        return 'Vérifier le code OTP';
      case 3:
        return 'Changer le mot de passe';
      default:
        return 'Suivant';
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <Envelope />
              </span>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Adresse email administrateur"
                value={email}
                onChange={handleInputChange}
                required
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <ShieldLock />
              </span>
              <input
                type="text"
                className="form-control"
                name="otp"
                placeholder="Code OTP (6 chiffres)"
                value={otp}
                onChange={handleInputChange}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                autoFocus
              />
            </div>
          </div>
        );

      case 3:
        return (
          <>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Lock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  placeholder="Nouveau mot de passe administrateur"
                  value={newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Lock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirmez le mot de passe"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container forgot-password-container " style={{ marginTop: '180px' }}
 >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">
                {step === 3 ? 'Nouveau mot de passe admin' : 'Réinitialisation admin'}
              </h3>

              <p className="text-muted text-center mb-4">
                {step === 1 && 'Entrez votre email administrateur'}
                {step === 2 && 'Code OTP envoyé à votre adresse email '}
                {step === 3 && 'Choisissez un mot de passe complexe (12 caractères minimum)'}
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
                {renderFormStep()}

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-2"
                  disabled={loading}
                >
                  {getButtonText()}
                </button>

                {step !== 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => setStep((prev) => prev - 1)}
                  >
                    Retour
                  </button>
                )}

                <div className="text-center mt-3">
                  <Link to={paths.signin} className="text-decoration-none">
                    Retour à la connexion admin
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

export default ForgotPasswordAdmin;