import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './SignIn.css';

const Signin = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email: user.email,
        mdp: user.password
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      navigate(response.data.role === 'admin' ? '/admin' : '/admin');
    } catch (err) {
      let errorMessage = 'Erreur de connexion';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Connexion Admin</h2>

                {error && (
                  <div className="alert alert-danger text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Adresse email"
                      value={user.email}
                      onChange={handleInputChange}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      placeholder="Mot de passe"
                      value={user.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!user.password}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="d-flex justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label">
                        Se souvenir de moi
                      </label>
                    </div>
                    <Link to="/adminforgot" className="text-decoration-none">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>

                <p className="text-center mt-4 text-muted">
                  Pas encore de compte ?{' '}
                  <Link to="/adminsignup" className="text-decoration-none">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;