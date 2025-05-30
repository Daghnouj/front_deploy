import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaCheckCircle, FaBook, FaFileAlt, FaDownload, FaUser } from 'react-icons/fa';
import './demandes.css';

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [validationComment, setValidationComment] = useState('');
  const [certificationRef, setCertificationRef] = useState('');
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Authentication required. Please login.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          'https://deploy-back-3.onrender.com/api/admin/unverified-requests',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const formattedRequests = response.data.requests.map(request => ({
          ...request,
          createdAt: new Date(request.createdAt).toLocaleDateString(),
          updatedAt: new Date(request.updatedAt).toLocaleDateString()
        }));
        setRequests(formattedRequests);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError('Error fetching verification requests');
        }
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!validationComment) newErrors.comment = 'Comment is required';
    if (!certificationRef) newErrors.ref = 'Reference is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (professionalId) => {
    if (!validateForm()) return;

    if (confirm('Confirm verification of this professional?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.put(
          `https://deploy-back-3.onrender.com/api/admin/verify/${professionalId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRequests(requests.filter(request => request.professional._id !== professionalId));
        setShowViewModal(false);
        setValidationComment('');
        setCertificationRef('');
        setAlert({ show: true, message: 'Professional verified successfully', type: 'success' });
      } catch (error) {
        console.error('Verification error:', error);
        setAlert({ 
          show: true, 
          message: error.response?.data?.message || 'Error verifying professional', 
          type: 'danger' 
        });
      }
    }
  };

  const handleDownload = async (documentUrl) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(documentUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      setAlert({ 
        show: true, 
        message: error.response?.status === 401 
          ? 'Authorization required for download' 
          : 'Error downloading document', 
        type: 'danger' 
      });
    }
  };

  const currentRequests = requests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) return <div className="text-center">Loading...</div>;
  
  if (error) return (
    <div className="container py-4">
      <div className="alert alert-danger">{error}</div>
      {error.includes('login') && (
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location = '/login'}
        >
          Go to Login
        </button>
      )}
    </div>
  );

  if (requests.length === 0) return <div className="alert alert-info">No pending requests</div>;

  return (
    <div className="verification-requests">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">Verification Requests</h1>
          <span className="badge bg-primary">
            {requests.length} pending request{requests.length !== 1 && 's'}
          </span>
        </div>

        <div className="row g-4">
          {currentRequests.map(request => (
            <div className="col-md-6 col-lg-4" key={request.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{request.professional.nom}</h5>
                    <span className="badge bg-secondary">{request.specialite}</span>
                  </div>
                  <p className="card-text text-muted line-clamp-3">{request.biographie}</p>
                  <div className="d-flex justify-content-between gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowViewModal(true);
                      }}
                    >
                      <FaEye className="me-2" /> Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(requests.length / itemsPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* View Modal */}
        <div className={`modal fade ${showViewModal ? 'show' : ''}`} style={{ display: showViewModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedRequest && (
                  <>
                    <section className="mb-5">
                      <h6 className="section-titled"><FaUser className="me-2" />Professional</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <p className="form-control-static">{selectedRequest.professional.nom}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <p className="form-control-static">{selectedRequest.professional.email}</p>
                        </div>
                      </div>
                    </section>

                    <section className="mb-5">
                      <h6 className="section-titled"><FaBook className="me-2" />Diploma</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Diploma Title</label>
                          <p className="form-control-static">{selectedRequest.intitule_diplome}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Obtained Date</label>
                          <p className="form-control-static">
                            {new Date(selectedRequest.date_obtention_diplome).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Professional Situation</label>
                          <p className="form-control-static">{selectedRequest.situation_professionnelle}</p>
                        </div>
                      </div>
                    </section>

                    <section className="mb-5">
                      <h6 className="section-titled"><FaBook className="me-2" />Institution</h6>
                      <div className="row">
                        <div className="col-12">
                          <label className="form-label">Institution Name</label>
                          <p className="form-control-static">{selectedRequest.nom_etablissement}</p>
                        </div>
                      </div>
                    </section>

                    <section className="mb-5">
                      <h6 className="section-titled"><FaFileAlt className="me-2" />Documents</h6>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleDownload(
                          `https://deploy-back-3.onrender.com/api/admin/download/${selectedRequest.document.split('\\').pop()}`
                        )}
                      >
                        <FaDownload className="me-2" /> Download Diploma
                      </button>
                    </section>

                    <section>
                      <h6 className="section-titled"><FaCheckCircle className="me-2" />Validation</h6>
                      <div className="bg-light p-4 rounded-3">
                        <div className="mb-3">
                          <label className="form-label">Validation Comment</label>
                          <textarea
                            className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                            rows={4}
                            value={validationComment}
                            onChange={(e) => setValidationComment(e.target.value)}
                          />
                          {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Certification Reference</label>
                          <input
                            type="text"
                            className={`form-control ${errors.ref ? 'is-invalid' : ''}`}
                            value={certificationRef}
                            onChange={(e) => setCertificationRef(e.target.value)}
                          />
                          {errors.ref && <div className="invalid-feedback">{errors.ref}</div>}
                        </div>
                        <button
                          className="btn btn-success w-100"
                          onClick={() => handleVerify(selectedRequest.professional._id)}
                        >
                          <FaCheckCircle className="me-2" /> Validate Request
                        </button>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type} fixed-alert`}>
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })}></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationRequests;