import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './adminpartenaires.css';

const BASE_URL = 'http://localhost:5000/api/partenaires';
const BACKEND_BASE_URL = 'http://localhost:5000';

function PartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    description: '',
    logo: '',
    service: ''
  });
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const partnersPerPage = 6;

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setPartners(res.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const validateForm = (formData, isNew = true) => {
    const newErrors = {};
    if (!formData.nom?.trim()) newErrors.nom = 'Name required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.service?.trim()) newErrors.service = 'Service required';
    if (isNew && !file) newErrors.logo = 'Logo required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (validateForm(newPartner, true)) {
      try {
        const formData = new FormData();
        formData.append('nom', newPartner.nom);
        formData.append('email', newPartner.email);
        formData.append('service', newPartner.service);
        formData.append('telephone', newPartner.telephone || '');
        formData.append('adresse', newPartner.adresse || '');
        formData.append('description', newPartner.description || '');
        if (file) formData.append('logos', file);

        const res = await axios.post(BASE_URL, formData);
        setPartners([...partners, res.data]);
        setShowAddModal(false);
        resetForm();
      } catch (error) {
        console.error("Error creating partner:", error);
      }
    }
  };

  const handleEditPartner = async (e) => {
    e.preventDefault();
    if (selectedPartner && validateForm(editData, false)) {
      try {
        const formData = new FormData();
        formData.append('nom', editData.nom || '');
        formData.append('email', editData.email || '');
        formData.append('service', editData.service || '');
        formData.append('telephone', editData.telephone || '');
        formData.append('adresse', editData.adresse || '');
        formData.append('description', editData.description || '');
        if (file) formData.append('logos', file);

        const res = await axios.put(`${BASE_URL}/${selectedPartner.id}`, formData);
        setPartners(partners.map(p => p.id === selectedPartner.id ? res.data : p));
        setShowEditModal(false);
        resetForm();
      } catch (error) {
        console.error("Error updating partner:", error);
      }
    }
  };

  const handleDeletePartner = async (id) => {
  if (confirm('Are you sure you want to delete this partner?')) {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setPartners(partners.filter(p => p._id !== id)); // Changed from p.id to p._id
    } catch (error) {
      console.error("Error deleting partner:", error);
      setErrors({
        deleteError: error.response?.data?.message || 'Failed to delete partner'
      });
    }
  }
};

  const resetForm = () => {
    setNewPartner({
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      description: '',
      logo: '',
      service: ''
    });
    setFile(null);
    setErrors({});
  };

  const indexOfLastPartner = page * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = partners.slice(indexOfFirstPartner, indexOfLastPartner);

  return (
    <div className="partners-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">Partners Management</h1>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2" /> New Partner
          </button>
        </div>

        <div className="row g-4">
          {currentPartners.map(partner => (
            <div className="col-md-6 col-lg-4" key={partner.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <img 
                      src={partner.logo ? 
                        `${BACKEND_BASE_URL}/uploads/partenaires/${partner.logo}` 
                        : '/default-logo.jpg'
                      }
                      alt={partner.nom}
                      className="partner-logo"
                    />
                    <h5 className="mt-3">{partner.nom}</h5>
                    <span className="badge bg-primary">{partner.service}</span>
                  </div>

                  <ul className="list-unstyled partner-info">
                    <li>
                      <FaEnvelope className="me-2" />
                      {partner.email}
                    </li>
                    {partner.telephone && (
                      <li>
                        <FaPhone className="me-2" />
                        {partner.telephone}
                      </li>
                    )}
                    {partner.adresse && (
                      <li>
                        <FaMapMarkerAlt className="me-2" />
                        {partner.adresse}
                      </li>
                    )}
                  </ul>

                  <div className="d-flex justify-content-end gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedPartner(partner);
                        setShowViewModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setSelectedPartner(partner);
                        setEditData(partner);
                        setShowEditModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
  className="btn btn-sm btn-outline-danger"
  onClick={() => handleDeletePartner(partner._id)} // Changed from partner.id to partner._id
>
  <FaTrash />
</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(partners.length / partnersPerPage) }).map((_, index) => (
              <li 
                key={index}
                className={`page-item ${page === index + 1 ? 'active' : ''}`}
              >
                <button 
                  className="page-link"
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Add Partner Modal */}
        <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Partner</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddPartner}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                      value={newPartner.nom}
                      onChange={(e) => setNewPartner({ ...newPartner, nom: e.target.value })}
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={newPartner.email}
                      onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service</label>
                    <input
                      type="text"
                      className={`form-control ${errors.service ? 'is-invalid' : ''}`}
                      value={newPartner.service}
                      onChange={(e) => setNewPartner({ ...newPartner, service: e.target.value })}
                    />
                    {errors.service && <div className="invalid-feedback">{errors.service}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Logo</label>
                    <input
                      type="file"
                      className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept="image/*"
                    />
                    {errors.logo && <div className="invalid-feedback">{errors.logo}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPartner.telephone}
                      onChange={(e) => setNewPartner({ ...newPartner, telephone: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      value={newPartner.adresse}
                      onChange={(e) => setNewPartner({ ...newPartner, adresse: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={newPartner.description}
                      onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save Partner</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* View Partner Modal */}
        <div className={`modal fade ${showViewModal ? 'show' : ''}`} style={{ display: showViewModal ? 'block' : 'none' }}>
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedPartner?.nom}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <img 
                    src={selectedPartner?.logo ? 
                      `${BACKEND_BASE_URL}/uploads/partenaires/${selectedPartner.logo}` 
                      : '/default-logo.jpg'
                    }
                    alt={selectedPartner?.nom}
                    className="partner-logo-lg"
                  />
                  <h4 className="mt-3">{selectedPartner?.nom}</h4>
                  <div className="badge bg-primary mb-3">{selectedPartner?.service}</div>
                </div>

                <ul className="list-unstyled">
                  <li className="mb-3">
                    <FaEnvelope className="me-2" />
                    {selectedPartner?.email}
                  </li>
                  {selectedPartner?.telephone && (
                    <li className="mb-3">
                      <FaPhone className="me-2" />
                      {selectedPartner.telephone}
                    </li>
                  )}
                  {selectedPartner?.adresse && (
                    <li className="mb-3">
                      <FaMapMarkerAlt className="me-2" />
                      {selectedPartner.adresse}
                    </li>
                  )}
                  {selectedPartner?.description && (
                    <li className="mt-4">
                      <h6>Description</h6>
                      <p>{selectedPartner.description}</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Partner Modal */}
        <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Partner</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditPartner}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                      value={editData.nom || ''}
                      onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service</label>
                    <input
                      type="text"
                      className={`form-control ${errors.service ? 'is-invalid' : ''}`}
                      value={editData.service || ''}
                      onChange={(e) => setEditData({ ...editData, service: e.target.value })}
                    />
                    {errors.service && <div className="invalid-feedback">{errors.service}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Logo</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept="image/*"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.telephone || ''}
                      onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      value={editData.adresse || ''}
                      onChange={(e) => setEditData({ ...editData, adresse: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnersManagement;