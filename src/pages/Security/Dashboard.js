import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user || user.userType !== 'security') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const todayStats = {
    completedScans: 8,
    totalGates: 15,
    lastScan: '14:30',
    patrolStatus: 'Active'
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Security Officer Dashboard</h1>
          <p>Welcome, Officer {user.lastName}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{todayStats.completedScans}</h3>
            <p>Scans Today</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚪</div>
          <div className="stat-content">
            <h3>{todayStats.totalGates}</h3>
            <p>Total Gates</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{todayStats.lastScan}</h3>
            <p>Last Scan</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>{todayStats.patrolStatus}</h3>
            <p>Patrol Status</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Patrol Actions</h2>
        <div className="action-grid">
          <button 
            className="action-card primary"
            onClick={() => navigate('/security/scan')}
          >
            <span className="action-icon">📷</span>
            <span>Scan QR Code</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => navigate('/security/patrol-history')}
          >
            <span className="action-icon">📋</span>
            <span>Patrol History</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => alert('Emergency feature coming soon!')}
          >
            <span className="action-icon">🚨</span>
            <span>Emergency Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;