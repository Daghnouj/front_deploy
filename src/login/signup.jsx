import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import signupImage from "../assets/login4.jpeg";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mdp: "",
    dateNaissance: "",
    adresse: "",
    telephone: "",
    role: "patient",
    specialite: "",
    situation_professionnelle: "",
    intitule_diplome: "",
    nom_etablissement: "",
    date_obtention_diplome: "",
    biographie: "",
    documents: null,
    specialiteInput: "",
  });

  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, documents: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "documents") {
          if (value) formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRedirect = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Fixed Image Section */}
        <div 
          className="d-none d-md-block position-fixed h-100"
          style={{
            width: "66.666%",
            left: "-12px",
            top: 0,
            zIndex: 0
          }}
        >
          <div
            className="h-100 w-100 bg-cover"
            style={{
              backgroundImage: `url(${signupImage})`,
              backgroundPosition: "center center",
              backgroundSize: "cover"
            }}
          />
        </div>

        {/* Scrollable Form Section */}
        <div 
          className="col-md-4 bg-white ms-auto"
          style={{
            minHeight: "100vh",
            overflowY: "auto",
            zIndex: 1,
            marginLeft: "66.666%"
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-85 px-4 py-5"
          >
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3 text-start" style={{ color: "#2563eb" }}>
                Create an Account
              </h2>
              <p className="text-muted text-start">Enter your information to get started</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Personal Information Fields */}
              <div className="mb-3">
                <label htmlFor="nom" className="form-label fw-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control border-2 py-2 rounded-5"
                  id="nom"
                  placeholder="Your full name"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control border-2 py-2 rounded-5"
                  id="email"
                  placeholder="example@email.com"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mdp" className="form-label fw-medium">
                  Password
                </label>
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

              <div className="mb-3">
                <label htmlFor="dateNaissance" className="form-label fw-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-control border-2 py-2 rounded-5"
                  id="dateNaissance"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="adresse" className="form-label fw-medium">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control border-2 py-2 rounded-5"
                  id="adresse"
                  placeholder="Your address"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="telephone" className="form-label fw-medium">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control border-2 py-2 rounded-5"
                  id="telephone"
                  placeholder="Phone number"
                  onChange={handleChange}
                  style={{ borderColor: "#e2e8f0" }}
                  required
                />
              </div>

              {/* Professional Checkbox */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isDoctor"
                  style={{ accentColor: "#2563eb" }}
                  onChange={(e) => {
                    setIsDoctor(e.target.checked);
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.checked ? "professional" : "patient",
                    }));
                  }}
                />
                <label className="form-check-label text-muted">
                  Are you a professional?
                </label>
              </div>

              {/* Professional Fields */}
              {isDoctor && (
                <>
                  <div className="mb-3">
                    <label htmlFor="specialite" className="form-label fw-medium">
                      Specialty
                    </label>
                    <select
                      className="form-control border-2 py-2 rounded-5"
                      id="specialite"
                      onChange={handleChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                    >
                      <option value="">Choose a specialty</option>
                      <option value="Thérapeute">Therapist</option>
                      <option value="Coach">Coach</option>
                      <option value="Psychologue">Psychologist</option>
                      <option value="Sophrologue">Sophrologist</option>
                      <option value="Naturopathe">Naturopath</option>
                      <option value="Kinésithérapeute">Physiotherapist</option>
                      <option value="Autre">Other</option>
                    </select>
                  </div>

                  {formData.specialite === "Autre" && (
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control border-2 py-2 rounded-5"
                        placeholder="Specify your specialty"
                        value={formData.specialiteInput || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specialite: e.target.value,
                            specialiteInput: e.target.value,
                          }))
                        }
                        style={{ borderColor: "#e2e8f0" }}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="situation_professionnelle" className="form-label fw-medium">
                      Professional Situation
                    </label>
                    <input
                      type="text"
                      className="form-control border-2 py-2 rounded-5"
                      id="situation_professionnelle"
                      placeholder="Professional situation"
                      onChange={handleChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="intitule_diplome" className="form-label fw-medium">
                      Diploma Title
                    </label>
                    <input
                      type="text"
                      className="form-control border-2 py-2 rounded-5"
                      id="intitule_diplome"
                      placeholder="Diploma title"
                      onChange={handleChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nom_etablissement" className="form-label fw-medium">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      className="form-control border-2 py-2 rounded-5"
                      id="nom_etablissement"
                      placeholder="Institution name"
                      onChange={handleChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="date_obtention_diplome" className="form-label fw-medium">
                      Graduation Date
                    </label>
                    <input
                      type="date"
                      className="form-control border-2 py-2 rounded-5"
                      id="date_obtention_diplome"
                      onChange={handleChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="biographie" className="form-label fw-medium">
                      Biography
                    </label>
                    <textarea
                      className="form-control border-2 py-2 rounded-5"
                      id="biographie"
                      placeholder="Biography"
                      rows="3"
                      onChange={handleChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="documents" className="form-label fw-medium">
                      Documents (PDF)
                    </label>
                    <input
                      type="file"
                      className="form-control border-2 py-2 rounded-5"
                      id="documents"
                      onChange={handleFileChange}
                      style={{ borderColor: "#e2e8f0" }}
                      required
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                </>
              )}

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
                {loading ? "Signing up..." : "Sign Up"}
              </motion.button>
            </form>

            {/* Social Login Section */}
            <div className="text-center my-4 position-relative">
              <hr className="border-1" style={{ borderColor: "#e2e8f0" }} />
              <span
                className="position-absolute bg-white px-3 text-muted"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "0.9rem",
                }}
              >
                OR CONTINUE WITH
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
                <FaGoogle className="fs-5" />
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
                <FaFacebook className="fs-5" />
                Facebook
              </button>
            </div>

            <p className="text-center text-muted mt-4">
              Already a member?{" "}
              <Link
                to="/login"
                className="fw-bold text-decoration-none"
                style={{ color: "#2563eb" }}
              >
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;