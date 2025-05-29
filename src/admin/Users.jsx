import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilSquare, Trash, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import './Users.css';

const API_URL = 'https://deploy-back-3.onrender.com/api/admin';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const usersPerPage = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = selectedRole !== 'all' ? {
          role: selectedRole === 'professional' ? 'professional' : 'patient'
        } : {};

        const response = await api.get('/users', { params });
        setUsers(response.data.users);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedRole]);

  const handleError = (error) => {
    let message = 'An error occurred';
    if (axios.isAxiosError(error)) {
      message = error.response?.data.message || 'Server communication error';
    } else if (error instanceof Error) {
      message = error.message;
    }
    setError(message);
  };

  const handleEdit = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.put(`/users/${selectedUser._id}`, editData);
      setUsers(users.map(user =>
        user._id === selectedUser._id ? response.data.user : user
      ));
      setShowEdit(false);
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      await api.patch(`/users/${userId}/status`, { isActive });
      setUsers(users.map(user =>
        user._id === userId ? { ...user, isActive } : user
      ));
    } catch (err) {
      handleError(err);
    }
  };

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">User Management</h1>
          <div className="btn-group">
            <button
              className={`btn ${selectedRole === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedRole('all')}
            >
              All
            </button>
            <button
              className={`btn ${selectedRole === 'patient' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedRole('patient')}
            >
              Patients
            </button>
            <button
              className={`btn ${selectedRole === 'professional' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedRole('professional')}
            >
              Professionals
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.photo ? `https://deploy-back-3.onrender.com/uploads/${user.photo}?${Date.now()}` : '/default-avatar.png'}
                      alt={user.nom}
                      className="user-avatar rounded-circle"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </td>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td>{user.role === 'professional' ? 'Professional' : 'Patient'}</td>
                  <td>
                    {user.role === 'professional' ? (
                      user.is_verified ? (
                        <CheckCircleFill className="text-success" />
                      ) : (
                        <XCircleFill className="text-danger" />
                      )
                    ) : (
                      <CheckCircleFill className="text-success" />
                    )}
                  </td>
                  <td>
                    <span className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`} />
                    {user.isOnline ? 'Online' : 'Offline'}
                  </td>
                  <td>
                    {user.lastLogin ?
                      new Date(user.lastLogin).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) :
                      'Never'}
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={user.isActive}
                        onChange={(e) => handleStatusChange(user._id, e.target.checked)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSelectedUser(user);
                          setEditData(user);
                          setShowEdit(true);
                        }}
                      >
                        <PencilSquare />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${page === index + 1 ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => setPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`modal fade ${showEdit ? 'show' : ''}`} style={{ display: showEdit ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.nom || ''}
                      onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      required
                    />
                  </div>
                  {selectedUser && selectedUser.role === 'professional' && (
                    <div className="mb-3 form-check form-switch">
                      <label className="form-check-label">
                        Professional Verification
                      </label>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={!!editData.is_verified}
                        onChange={(e) => setEditData({ ...editData, is_verified: e.target.checked })}
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary w-100">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
