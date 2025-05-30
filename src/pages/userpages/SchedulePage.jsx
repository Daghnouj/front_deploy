import { useState, useEffect } from "react";
import { 
  FaClipboardList, 
  FaHistory, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "./SchedulePage.css";

const SchedulePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMapping = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed'
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('http://localhost:5000/api/booking/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch bookings');

        const data = await response.json();
        setRequests(data.map(booking => ({
          id: booking._id,
          date: booking.date,
          status: statusMapping[booking.status],
          therapist: booking.therapistId?.nom,
          ville: booking.ville,
          problem: booking.probleme,
          medicalHistory: booking.antecedentsMedicaux
        })));
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeRequests = requests.filter(request => 
    ["Pending", "Confirmed"].includes(request.status)
  );
  
  const requestHistory = requests.filter(request => 
    ["Completed", "Cancelled"].includes(request.status)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleCancel = async (id) => {
    const confirmation = window.confirm("Are you sure you want to cancel this request?");
    if (!confirmation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/booking/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('Cancellation failed');

      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === id ? { ...request, status: 'Cancelled' } : request
        )
      );
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel appointment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <FaCheckCircle className="status-icon" />;
      case 'Cancelled': return <FaTimesCircle className="status-icon" />;
      case 'Completed': return <FaCheckCircle className="status-icon" />;
      case 'Pending': return <FaExclamationCircle className="status-icon" />;
      default: return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return "status-pending";
      case 'Confirmed': return "status-approved";
      case 'Cancelled': return "status-cancelled";
      case 'Completed': return "status-completed";
      default: return "";
    }
  };

  if (loading) {
    return <div className="schedule-container">Loading appointments...</div>;
  }

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <h2 className="schedule-title">
          <FaCalendarAlt className="title-icon" />
          My Appointments
        </h2>
      </header>

      <div className="schedule-card">
        <div className="card-header bg-primary">
          <div className="header-content">
            <FaClipboardList className="header-icon" />
            <div>
              <h3 className="section-titles">My Requests</h3>
              <p className="card-subtitle">{activeRequests.length} active requests</p>
            </div>
          </div>
          <span className="status-badge">
            {activeRequests.filter(r => r.status === 'Pending').length} pending
          </span>
        </div>
        
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Therapist</th>
                <th>Date</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.therapist || 'N/A'}</td>
                  <td>{formatDate(request.date)}</td>
                  <td>{request.ville}</td>
                  <td>
                    <div className={`status-container ${getStatusClass(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span>{request.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-cancel" 
                        onClick={() => handleCancel(request.id)}
                        disabled={request.status !== 'Pending'}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="schedule-card">
        <div className="card-header bg-secondary">
          <div className="header-content">
            <FaHistory className="header-icon" />
            <div>
              <h3 className="section-titles">Request History</h3>
              <p className="card-subtitle">Past appointments</p>
            </div>
          </div>
          <span className="status-badge">{requestHistory.length} entries</span>
        </div>
        
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Therapist</th>
                <th>Date</th>
                <th>City</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requestHistory.map(history => (
                <tr key={history.id}>
                  <td>{history.therapist || 'N/A'}</td>
                  <td>{formatDate(history.date)}</td>
                  <td>{history.ville}</td>
                  <td>
                    <div className={`status-container ${getStatusClass(history.status)}`}>
                      {getStatusIcon(history.status)}
                      <span>{history.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;