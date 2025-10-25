import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    activeOfficers: 0,
    totalMembers: 0,
    suspendedAccounts: 0,
    recentAlerts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      pendingApprovals: 5,
      activeOfficers: 12,
      totalMembers: 150,
      suspendedAccounts: 3,
      recentAlerts: 2
    });

    setRecentActivity([
      { id: 1, type: 'registration', user: 'John Doe', time: '2 hours ago', status: 'pending' },
      { id: 2, type: 'suspension', user: 'Mike Wilson', time: '5 hours ago', status: 'completed' },
      { id: 3, type: 'patrol_issue', user: 'Officer Smith', time: '1 day ago', status: 'investigating' }
    ]);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const approveUser = (userId) => {
    // Mock approval - replace with API call
    alert(`User ${userId} approved successfully`);
    setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
  };

  const suspendUser = (userId) => {
    // Mock suspension - replace with API call
    alert(`User ${userId} suspended`);
    setStats(prev => ({ ...prev, suspendedAccounts: prev.suspendedAccounts + 1 }));
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

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user.firstName}!</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/admin/manage-users')}>
            User Management
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/manage-users')}
          >
            Review
          </button>
        </div>

        <div className="stat-card officers">
          <div className="stat-icon">👮</div>
          <div className="stat-content">
            <h3>{stats.activeOfficers}</h3>
            <p>Active Officers</p>
          </div>
          <div className="stat-trend">↑ 2 this week</div>
        </div>

        <div className="stat-card members">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
          <div className="stat-trend">↑ 5 today</div>
        </div>

        <div className="stat-card suspended">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>{stats.suspendedAccounts}</h3>
            <p>Suspended Accounts</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/manage-users?filter=suspended')}
          >
            Manage
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/admin/manage-users')}>
            <div className="action-icon">👥</div>
            <h4>Manage Users</h4>
            <p>Approve, suspend, or delete user accounts</p>
          </div>

          <div className="action-card" onClick={() => navigate('/admin/reports')}>
            <div className="action-icon">📊</div>
            <h4>View Reports</h4>
            <p>Weekly, monthly, and yearly patrol reports</p>
          </div>

          <div className="action-card" onClick={() => navigate('/admin/settings')}>
            <div className="action-icon">⚙️</div>
            <h4>System Settings</h4>
            <p>Configure system parameters and alerts</p>
          </div>

          <div className="action-card" onClick={() => alert('Payment monitoring coming soon!')}>
            <div className="action-icon">💰</div>
            <h4>Payment Monitoring</h4>
            <p>Track subscription payments and status</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'registration' && '📝'}
                {activity.type === 'suspension' && '⏸️'}
                {activity.type === 'patrol_issue' && '🚨'}
              </div>
              <div className="activity-details">
                <p className="activity-description">
                  {activity.type === 'registration' && `New registration from ${activity.user}`}
                  {activity.type === 'suspension' && `Account suspended: ${activity.user}`}
                  {activity.type === 'patrol_issue' && `Patrol issue reported by ${activity.user}`}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
              <div className={`activity-status ${activity.status}`}>
                {activity.status}
              </div>
              {activity.type === 'registration' && (
                <button 
                  className="btn-small"
                  onClick={() => approveUser(activity.id)}
                >
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="system-alerts">
        <h2>System Alerts</h2>
        <div className="alert-list">
          <div className="alert-item warning">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <h4>Low Patrol Compliance</h4>
              <p>3 security officers below 70% scan compliance this week</p>
            </div>
            <button className="btn-small">Review</button>
          </div>
          
          <div className="alert-item info">
            <div className="alert-icon">ℹ️</div>
            <div className="alert-content">
              <h4>System Update Available</h4>
              <p>New version 2.1.0 ready for deployment</p>
            </div>
            <button className="btn-small">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;