import React from "react";
import { FaUserMd, FaCalendarAlt, FaBell, FaArrowUp, FaUsers } from "react-icons/fa";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const recentPatients = [
    { name: "Jean Dupont", age: 15, condition: "Autism" },
    { name: "Sophie Martin", age: 9, condition: "Autism" },
    { name: "Lucas Bernard", age: 14, condition: "Autism" },
  ];

  const upcomingAppointments = [
    { patient: "Emma Lefevre", date: "2025-03-17", time: "10:00 AM" },
    { patient: "Paul Durand", date: "2025-03-17", time: "11:30 AM" },
    { patient: "Nina Dubois", date: "2025-03-18", time: "02:00 PM" },
  ];

  const notifications = [
    "Nouveau rendez-vous demandé par Pierre Morel",
    "Résultats d'analyse disponibles pour Alice Fontaine",
    "Mise à jour du protocole COVID-19",
  ];

  // Chart data
  const patientStats = [
    { month: 'Jan', patients: 65 },
    { month: 'Feb', patients: 75 },
    { month: 'Mar', patients: 85 },
    { month: 'Apr', patients: 70 },
    { month: 'May', patients: 90 },
    { month: 'Jun', patients: 95 },
  ];

  const appointmentDistribution = [
    { type: 'Consultation', value: 65 },
    { type: 'Suivi', value: 25 },
    { type: 'Urgence', value: 10 }
  ];

  const COLORS = ['var(--doctor-primary)', 'var(--doctor-success)', 'var(--doctor-accent)'];

  return (
    <div className="doctor-dashboard-container">
      <h1 className="text-center mb-4">Tableau de Bord Médecin</h1>

      {/* Stats Cards Grid */}
      <div className="doctor-stats-grid">
        {/* Patients Card */}
        <div className="doctor-stat-card">
          <div className="doctor-stat-header doctor-stat-primary">
            <FaUserMd className="doctor-stat-icon" />
            <h3 className="doctor-stat-title">Patients Actuels</h3>
          </div>
          <div className="doctor-stat-content">
            <span className="doctor-stat-number">150</span>
            <p className="doctor-stat-subtext">Patients en suivi</p>
            <button className="doctor-stat-button doctor-stat-primary">
              Voir les dossiers
            </button>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="doctor-stat-card">
          <div className="doctor-stat-header doctor-stat-secondary">
            <FaCalendarAlt className="doctor-stat-icon" />
            <h3 className="doctor-stat-title">Rendez-vous</h3>
            <span className="doctor-status-dot"></span>
          </div>
          <div className="doctor-stat-content">
            <span className="doctor-stat-number">5</span>
            <p className="doctor-stat-subtext">À venir cette semaine</p>
            <button className="doctor-stat-button doctor-stat-secondary">
              Voir agenda
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="doctor-stat-card">
          <div className="doctor-stat-header doctor-stat-accent">
            <FaBell className="doctor-stat-icon" />
            <h3 className="doctor-stat-title">Notifications</h3>
          </div>
          <div className="doctor-stat-content">
            <span className="doctor-stat-number">{notifications.length}</span>
            <p className="doctor-stat-subtext">Nouvelles notifications</p>
            <button className="doctor-stat-button doctor-stat-accent">
              Voir alertes
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="doctor-charts-grid">
        {/* Patients Chart */}
        <div className="doctor-chart-card">
          <div className="doctor-chart-header">
            <h3 className="doctor-chart-title">Statistiques des Patients</h3>
            <div className="performance-badge">
              <FaArrowUp className="trend-icon" />
              <span>15% vs mois dernier</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientStats}>
                <XAxis 
                  dataKey="month" 
                  stroke="var(--doctor-muted)" 
                  tick={{ fill: 'var(--doctor-muted)' }}
                />
                <YAxis 
                  stroke="var(--doctor-muted)" 
                  tick={{ fill: 'var(--doctor-muted)' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="var(--doctor-primary)" 
                  strokeWidth={2}
                  dot={{ 
                    fill: 'var(--doctor-primary)', 
                    strokeWidth: 2,
                    stroke: 'var(--doctor-surface)'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="doctor-chart-card">
          <div className="doctor-chart-header">
            <h3 className="doctor-chart-title">Répartition des Consultations</h3>
            <div className="user-stats">
              <FaUsers className="user-icon" />
              <span>Total: 100 consultations</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appointmentDistribution.map((entry, index) => (
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
                  formatter={(value) => <span style={{ color: 'var(--doctor-text-dark)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Medical Lists Section */}
      <div className="doctor-charts-grid">
        {/* Recent Patients List */}
        <div className="doctor-chart-card">
          <div className="doctor-chart-header">
            <h3 className="doctor-chart-title">Patients Récents</h3>
          </div>
          <div className="list-container">
            <ul className="doctor-medical-list">
              {recentPatients.map((patient, index) => (
                <li className="doctor-list-item" key={index}>
                  <div className="doctor-patient-info">
                    <strong>{patient.name}</strong>
                    <span className="doctor-patient-age">{patient.age} ans</span>
                  </div>
                  <div className="doctor-patient-condition">
                    {patient.condition}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Appointments List */}
        <div className="doctor-chart-card">
          <div className="doctor-chart-header">
            <h3 className="doctor-chart-title">Prochains Rendez-vous</h3>
          </div>
          <div className="list-container">
            <ul className="doctor-medical-list">
              {upcomingAppointments.map((appointment, index) => (
                <li className="doctor-list-item" key={index}>
                  <div className="doctor-appointment-time">
                    {appointment.time}
                  </div>
                  <div className="doctor-patient-info">
                    <strong>{appointment.patient}</strong>
                    <span className="doctor-patient-age">{appointment.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="doctor-chart-card mt-4">
        <div className="doctor-chart-header">
          <h3 className="doctor-chart-title">Notifications Récentes</h3>
        </div>
        <div className="list-container">
          <ul className="doctor-medical-list">
            {notifications.map((notification, index) => (
              <li key={index} className="doctor-list-item doctor-notification-item">
                {notification}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;