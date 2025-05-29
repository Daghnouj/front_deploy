import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Signup.css';

const Signup = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/admin/signup', {
        nom: user.name,
        email: user.email,
        mdp: user.password
      });
      navigate('/signin');
    } catch (err) {
      let errorMessage = 'Signup failed. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Create Admin Account</h2>
                <p className="text-center text-muted mb-4">
                  Please fill in the information below
                </p>

                {error && (
                  <div className="alert alert-danger text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Your Name"
                      value={user.name}
                      onChange={handleInputChange}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Your Email"
                      value={user.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4 input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      placeholder="Your Password"
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

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </form>

                <p className="text-center mt-4 text-muted">
                  Already have an account?{' '}
                  <Link to="/adminsignin" className="text-decoration-none">
                    Sign In
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

export default Signup;