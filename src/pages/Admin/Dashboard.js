import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user || user.userType !== 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const stats = {
    pendingApprovals: 5,
    activeOfficers: 12,
    totalMembers: 150,
    suspendedAccounts: 3,
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user.firstName}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👮</div>
          <div className="stat-content">
            <h3>{stats.activeOfficers}</h3>
            <p>Active Officers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>{stats.suspendedAccounts}</h3>
            <p>Suspended Accounts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button 
            className="action-card"
            onClick={() => navigate('/admin/manage-users')}
          >
            <span className="action-icon">👥</span>
            <span>Manage Users</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => navigate('/admin/reports')}
          >
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => navigate('/admin/settings')}
          >
            <span className="action-icon">⚙️</span>
            <span>System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;