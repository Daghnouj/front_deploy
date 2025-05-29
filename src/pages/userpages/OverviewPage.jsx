import React, { useState } from "react";
import { 
  FaClipboardList, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaArrowUp,
  FaUsers
} from "react-icons/fa";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend 
} from "recharts";
import "./OverviewPage.css";

const OverviewPage = () => {
  const [stats] = useState({
    pendingRequests: 5,
    messages: 7,
    upcomingEvents: 3,
  });

  // Chart data
  const performanceData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 75 },
    { name: 'Mar', value: 85 },
    { name: 'Apr', value: 70 },
    { name: 'May', value: 90 },
    { name: 'Jun', value: 95 },
  ];

  const requestDistribution = [
    { name: 'Approved', value: 12 },
    { name: 'Pending', value: 5 },
    { name: 'Rejected', value: 3 }
  ];

  const COLORS = ['#4CAF50', '#457AFF', '#FF6B35'];

  return (
    <div className="overview-container">
      <div className="overview-grid">
        {/* Pending Requests Card */}
        <div className="overview-card">
          <div className="card-header bg-primary">
            <FaClipboardList className="card-icon" />
            <h3 className="card-title">Pending Requests</h3>
          </div>
          <div className="card-content">
            <span className="card-stat">{stats.pendingRequests}</span>
            <p className="card-subtext">Awaiting approval</p>
            <button className="card-btn bg-primary">
              Review Requests
            </button>
          </div>
        </div>

        {/* Messages Card */}
        <div className="overview-card">
          <div className="card-header bg-primary">
            <FaEnvelope className="card-icon" />
            <h3 className="card-title">Messages</h3>
            <span className="status-dot active"></span>
          </div>
          <div className="card-content">
            <span className="card-stat">{stats.messages}</span>
            <p className="card-subtext">Unread messages</p>
            <button className="card-btn bg-primary">
              View Inbox
            </button>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="overview-card">
          <div className="card-header bg-secondary">
            <FaCalendarAlt className="card-icon" />
            <h3 className="card-title">Upcoming Events</h3>
          </div>
          <div className="card-content">
            <span className="card-stat">{stats.upcomingEvents}</span>
            <p className="card-subtext">Scheduled events</p>
            <button className="card-btn bg-secondary">
              View Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Performance Trend Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Monthly Performance</h3>
            <div className="performance-badge">
              <FaArrowUp className="trend-icon" />
              <span>12% vs last month</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="name" stroke="#666" />
                <YAxis domain={[0, 100]} stroke="#666" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#457AFF" 
                  strokeWidth={2}
                  dot={{ fill: '#457AFF', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Distribution Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Request Distribution</h3>
            <div className="user-stats">
              <FaUsers className="user-icon" />
              <span>Total: 20 requests</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {requestDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  align="right"
                  verticalAlign="middle"
                  layout="vertical"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;