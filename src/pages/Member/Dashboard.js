import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user || user.userType !== 'member') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const communityStats = {
    activePatrols: 3,
    recentAlerts: 1,
    communityPosts: 12,
    subscriptionStatus: 'Active',
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Member Dashboard</h1>
          <p>Welcome to Neighborhood Watch, {user.firstName}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👮</div>
          <div className="stat-content">
            <h3>{communityStats.activePatrols}</h3>
            <p>Active Patrols</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{communityStats.recentAlerts}</h3>
            <p>Recent Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{communityStats.communityPosts}</h3>
            <p>Community Posts</p>
          </div>
        </div>
        
        <div className={`stat-card ${communityStats.subscriptionStatus === 'Active' ? 'status-active' : 'status-inactive'}`}>
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{communityStats.subscriptionStatus}</h3>
            <p>Subscription</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Community Features</h2>
        <div className="action-grid">
          <button 
            className="action-card emergency"
            onClick={() => navigate('/member/emergency-alert')}
          >
            <span className="action-icon">🚨</span>
            <span>Emergency Alert</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => navigate('/member/community-forum')}
          >
            <span className="action-icon">💬</span>
            <span>Community Forum</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => alert('Patrol statistics coming soon!')}
          >
            <span className="action-icon">📊</span>
            <span>Patrol Statistics</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => alert('Payment history coming soon!')}
          >
            <span className="action-icon">💰</span>
            <span>Payment History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;