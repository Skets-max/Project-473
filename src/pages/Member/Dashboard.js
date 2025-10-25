import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './MemberDashboard.css';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [communityStats, setCommunityStats] = useState({
    activePatrols: 0,
    recentAlerts: 0,
    communityPosts: 0,
    subscriptionStatus: 'Active',
    paymentDue: null
  });
  const [recentPatrols, setRecentPatrols] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  useEffect(() => {
    // Mock data
    setCommunityStats({
      activePatrols: 3,
      recentAlerts: 1,
      communityPosts: 12,
      subscriptionStatus: 'Active',
      paymentDue: '2024-02-15'
    });

    setRecentPatrols([
      { id: 1, officer: 'Officer Smith', gate: 'Main Gate', time: '2 hours ago', status: 'on-time' },
      { id: 2, officer: 'Officer Johnson', gate: 'North Gate', time: '4 hours ago', status: 'on-time' },
      { id: 3, officer: 'Officer Brown', gate: 'South Gate', time: '6 hours ago', status: 'delayed' }
    ]);

    setCommunityPosts([
      { id: 1, user: 'Sarah M.', content: 'Has anyone seen the package delivery today?', time: '2 hours ago', comments: 3 },
      { id: 2, user: 'Mike R.', content: 'Community meeting this Saturday at the clubhouse!', time: '5 hours ago', comments: 8 },
      { id: 3, user: 'Lisa T.', content: 'Lost cat near Block 7. Please keep an eye out!', time: '1 day ago', comments: 12 }
    ]);

    setEmergencyAlerts([
      { id: 1, type: 'suspicious_activity', location: 'Block 12', time: '1 hour ago', status: 'active' }
    ]);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const raiseEmergencyAlert = () => {
    const alertType = prompt('Select alert type:\n1. Emergency\n2. Suspicious Activity\n3. Medical Emergency\n4. Fire');
    if (alertType) {
      alert(`Emergency alert raised! Security officers have been notified. Type: ${alertType}`);
      // In real app, this would trigger notifications to all members and security
    }
  };

  const makePayment = () => {
    const paymentAmount = 'X Pula'; // From requirements
    alert(`Redirecting to payment gateway for ${paymentAmount}...`);
    // In real app, integrate with Botswana payment methods
  };

  const postToCommunity = () => {
    const postContent = prompt('What would you like to share with the community?');
    if (postContent) {
      const newPost = {
        id: Date.now(),
        user: `${user.firstName} ${user.lastName}`,
        content: postContent,
        time: 'Just now',
        comments: 0
      };
      setCommunityPosts(prev => [newPost, ...prev]);
      setCommunityStats(prev => ({ ...prev, communityPosts: prev.communityPosts + 1 }));
    }
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

  return (
    <div className="member-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Member Dashboard</h1>
          <p>Welcome to Neighborhood Watch, {user.firstName}!</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={postToCommunity}>
            📝 Post to Community
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Community Stats */}
      <div className="community-stats">
        <div className="stat-card">
          <div className="stat-icon">👮</div>
          <div className="stat-content">
            <h3>{communityStats.activePatrols}</h3>
            <p>Active Patrols</p>
          </div>
          <div className="stat-trend positive">Live</div>
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
          <div className="stat-trend positive">+2 today</div>
        </div>

        <div className={`stat-card subscription ${communityStats.subscriptionStatus.toLowerCase()}`}>
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{communityStats.subscriptionStatus}</h3>
            <p>Subscription</p>
            {communityStats.paymentDue && (
              <small>Due: {new Date(communityStats.paymentDue).toLocaleDateString()}</small>
            )}
          </div>
          <button className="btn-small" onClick={makePayment}>
            Pay Now
          </button>
        </div>
      </div>

      {/* Emergency Alert Section */}
      <div className="emergency-section">
        <div className="emergency-card">
          <div className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <div>
              <h3>Emergency Alert System</h3>
              <p>Raise an alert to notify all members and security officers immediately</p>
            </div>
          </div>
          <button className="btn-emergency" onClick={raiseEmergencyAlert}>
            Raise Emergency Alert
          </button>
        </div>
      </div>

      {/* Recent Patrol Activity */}
      <div className="patrol-activity">
        <div className="section-header">
          <h2>Recent Patrol Activity</h2>
          <button 
            className="btn-outline"
            onClick={() => alert('Opening patrol statistics...')}
          >
            View Statistics
          </button>
        </div>
        
        <div className="patrols-list">
          {recentPatrols.map(patrol => (
            <div key={patrol.id} className={`patrol-item ${patrol.status}`}>
              <div className="patrol-avatar">
                {patrol.officer.split(' ')[1].charAt(0)}
              </div>
              <div className="patrol-details">
                <h4>{patrol.officer}</h4>
                <p>Scanned {patrol.gate}</p>
                <span className="patrol-time">{patrol.time}</span>
              </div>
              <div className={`patrol-status ${patrol.status}`}>
                {patrol.status === 'on-time' ? '✅ On Time' : '⚠️ Delayed'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Forum */}
      <div className="community-forum">
        <div className="section-header">
          <h2>Community Forum</h2>
          <button 
            className="btn-primary"
            onClick={postToCommunity}
          >
            New Post
          </button>
        </div>
        
        <div className="posts-list">
          {communityPosts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-avatar">
                {post.user.split(' ')[0].charAt(0)}
              </div>
              <div className="post-content">
                <div className="post-header">
                  <span className="post-user">{post.user}</span>
                  <span className="post-time">{post.time}</span>
                </div>
                <p className="post-text">{post.content}</p>
                <div className="post-actions">
                  <button className="action-btn">👍 Like</button>
                  <button className="action-btn">💬 Comment ({post.comments})</button>
                  <button className="action-btn">🔄 Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {emergencyAlerts.length > 0 && (
        <div className="active-alerts">
          <h2>Active Community Alerts</h2>
          <div className="alerts-list">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <h4>Suspicious Activity Reported</h4>
                  <p>Location: {alert.location} • Time: {alert.time}</p>
                  <small>Security officers are investigating the area</small>
                </div>
                <button className="btn-small">
                  Mark as Seen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div 
            className="action-card"
            onClick={() => navigate('/member/emergency-alert')}
          >
            <div className="action-icon">🚨</div>
            <h4>Emergency Alert</h4>
            <p>Immediate help request</p>
          </div>

          <div 
            className="action-card"
            onClick={() => navigate('/member/community-forum')}
          >
            <div className="action-icon">💬</div>
            <h4>Community Forum</h4>
            <p>Connect with neighbors</p>
          </div>

          <div 
            className="action-card"
            onClick={() => alert('Opening patrol statistics...')}
          >
            <div className="action-icon">📊</div>
            <h4>Patrol Stats</h4>
            <p>View security activity</p>
          </div>

          <div 
            className="action-card"
            onClick={() => alert('Opening payment history...')}
          >
            <div className="action-icon">💰</div>
            <h4>Payment History</h4>
            <p>Manage subscription</p>
          </div>

          <div 
            className="action-card"
            onClick={() => alert('Opening profile settings...')}
          >
            <div className="action-icon">👤</div>
            <h4>My Profile</h4>
            <p>Update information</p>
          </div>

          <div 
            className="action-card"
            onClick={() => alert('Opening neighborhood map...')}
          >
            <div className="action-icon">🗺️</div>
            <h4>Neighborhood Map</h4>
            <p>View patrol routes</p>
          </div>
        </div>
      </div>

      {/* Payment Reminder */}
      {communityStats.paymentDue && new Date(communityStats.paymentDue) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
        <div className="payment-reminder">
          <div className="reminder-icon">💰</div>
          <div className="reminder-content">
            <h4>Subscription Payment Due Soon</h4>
            <p>Your next payment of X Pula is due on {new Date(communityStats.paymentDue).toLocaleDateString()}</p>
          </div>
          <button className="btn-primary" onClick={makePayment}>
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;