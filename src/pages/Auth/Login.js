import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Check if user just registered
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registration successful! You can now login with your credentials.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        
        // Small delay to show success message
        setTimeout(() => {
          // Redirect based on user type
          switch(result.user.userType) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'security':
              navigate('/security/dashboard');
              break;
            case 'member':
              navigate('/member/dashboard');
              break;
            default:
              navigate('/member/dashboard');
          }
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (userType) => {
    const credentials = {
      admin: { email: 'admin@neighborhood.com', password: 'admin123' },
      security: { email: 'security@neighborhood.com', password: 'security123' },
      member: { email: 'member@neighborhood.com', password: 'member123' }
    };
    
    setFormData({
      ...formData,
      ...credentials[userType]
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">NeighborhoodWatch</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-section">
          <div className="demo-divider">
            <span>Quick Demo Access</span>
          </div>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="demo-btn admin"
              onClick={() => fillDemoCredentials('admin')}
            >
              <span className="demo-icon">👑</span>
              Admin
            </button>
            <button 
              type="button" 
              className="demo-btn security"
              onClick={() => fillDemoCredentials('security')}
            >
              <span className="demo-icon">🛡️</span>
              Security
            </button>
            <button 
              type="button" 
              className="demo-btn member"
              onClick={() => fillDemoCredentials('member')}
            >
              <span className="demo-icon">👤</span>
              Member
            </button>
          </div>
        </div>
        
        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">
            Forgot your password?
          </Link>
          <div className="auth-signup">
            Don't have an account? <Link to="/register" className="auth-link signup">Sign up</Link>
          </div>
          <Link to="/" className="auth-link home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;