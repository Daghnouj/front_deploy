import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminOverview.css';

ChartJS.register(...registerables);

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

const AdminOverView = () => {
  const [users, setUsers] = useState([]);
  const [unverifiedRequestsCount, setUnverifiedRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data configurations
  const websiteUsageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Website Visits',
      data: [12000, 19000, 15000, 18000, 21000, 20000],
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const ageDistributionData = {
    labels: ['18-24', '25-34', '35-44', '45+'],
    datasets: [{
      label: 'Users by Age',
      data: [35, 45, 15, 5],
      backgroundColor: ['#0d6efd', '#2aa876', '#ff6b6b', '#ffd93d']
    }]
  };

  const signupsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Signups',
      data: [150, 300, 250, 400, 350, 500],
      backgroundColor: '#0d6efd',
      borderRadius: 8
    }]
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, countRes] = await Promise.all([
          api.get('/users'),
          api.get('/unverified-requests/count')
        ]);
        
        setUsers(usersRes.data.users);
        setUnverifiedRequestsCount(countRes.data.count);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleError = (error) => {
    let message = 'An error occurred';
    if (axios.isAxiosError(error)) {
      message = error.response?.data.message || 'Server communication error';
    } else if (error instanceof Error) {
      message = error.message;
    }
    setError(message);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
     <div className="container-fluid admii-overview-container">
      {/* Header */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 admii-header">
        <h1 className="h2 admii-main-title">Dashboard Overview</h1>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4 admii-stats-row">
        <div className="col-md-4 mb-3">
          <div className="card admii-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="admii-stat-title">Total Users</h5>
                  <h2 className="admii-stat-value">{users.length}</h2>
                </div>
                <div className="admii-icon-container">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card admii-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="admii-stat-title">Verification Requests</h5>
                  <div className="d-flex align-items-center">
                    <h2 className="admii-stat-value me-3">{unverifiedRequestsCount}</h2>
                  </div>
                </div>
                <div className="admii-icon-container">
                  <i className="fas fa-clock fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card admii-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="admii-stat-title">New Signups</h5>
                  <h2 className="admii-stat-value">189</h2>
                </div>
                <div className="admii-icon-container">
                  <i className="fas fa-user-plus fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-4">
          <div className="admii-chart-card">
            <h5 className="admii-chart-title">Website Usage</h5>
            <div className="admii-chart-container">
              <Line 
                data={websiteUsageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 mb-4">
          <div className="admii-chart-card">
            <h5 className="admii-chart-title">User Age Distribution</h5>
            <div className="admii-chart-container">
              <Doughnut 
                data={ageDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="admii-chart-card">
            <h5 className="admii-chart-title">Monthly Signups</h5>
            <div className="admii-chart-container">
              <Bar
                data={signupsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="card admii-activity-card">
        <div className="card-header admii-activity-header">
          <h5 className="card-titlen text-black mb-0">Recent Users</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table admii-activity-table">
              <thead>
                <tr>
                  <th className="admii-table-header">Photo</th>
                  <th className="admii-table-header">Name</th>
                  <th className="admii-table-header">Email</th>
                  <th className="admii-table-header">Role</th>
                  <th className="admii-table-header">Verified</th>
                  <th className="admii-table-header">Status</th>
                  <th className="admii-table-header">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr className="admii-table-row" key={user._id}>
                    <td className="admii-table-data">
                      <img 
                        src={user.photo ? 
                          `https://deploy-back-3.onrender.com/uploads/${user.photo}?${Date.now()}` : 
                          '/default-avatar.png'}
                        alt={user.nom}
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </td>
                    <td className="admii-table-data">{user.nom}</td>
                    <td className="admii-table-data">{user.email}</td>
                    <td className="admii-table-data">
                      {user.role === 'professional' ? 'Professional' : 'Patient'}
                    </td>
                    <td className="admii-table-data">
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
                    <td className="admii-table-data">
                      <span className={`admii-status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="admii-table-data">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverView;