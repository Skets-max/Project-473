import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'member',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear specific field error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setMessage('');
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters and spaces';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    
    // Address validation for members
    if (formData.userType === 'member' && !formData.address.trim()) {
      newErrors.address = 'Address is required for community members';
    } else if (formData.userType === 'member' && formData.address.length < 10) {
      newErrors.address = 'Please provide a complete address (minimum 10 characters)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#e0e0e0' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    const strengthData = [
      { strength: 0, text: 'Very Weak', color: '#ff4444' },
      { strength: 1, text: 'Weak', color: '#ff8800' },
      { strength: 2, text: 'Fair', color: '#ffbb33' },
      { strength: 3, text: 'Good', color: '#00C851' },
      { strength: 4, text: 'Strong', color: '#007E33' },
      { strength: 5, text: 'Very Strong', color: '#007E33' }
    ][strength];
    
    return strengthData;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        setMessage(result.message);
        // Clear form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          userType: 'member',
          address: ''
        });
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">NeighborhoodWatch</span>
          </div>
          <h2>Join Our Community</h2>
          <p>Create your account to get started</p>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
            {message.includes('success') && (
              <div className="verification-note">
                <strong>Important:</strong> Check your spam folder if you don't see the email within 5 minutes.
                You must verify your email before you can login.
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your first name"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your last name"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="+267 XXX XXXX"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
            <small className="hint">Format: +267 followed by 7-8 digits</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="userType">I am a *</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="member">Community Member</option>
              <option value="security">Security Officer</option>
            </select>
          </div>
          
          {formData.userType === 'member' && (
            <div className="form-group">
              <label htmlFor="address">Home Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your full residential address"
                className={errors.address ? 'error' : ''}
                rows="3"
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Create a strong password"
                className={errors.password ? 'error' : ''}
              />
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              {errors.password && <span className="field-error">{errors.password}</span>}
              <small className="hint">
                Password must contain: 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&)
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="field-success">✓ Passwords match</span>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="auth-links">
          <div className="auth-signup">
            Already have an account? <Link to="/login" className="auth-link signup">Sign in</Link>
          </div>
          <Link to="/" className="auth-link home">
            ← Back to Home
          </Link>
        </div>

        <div className="privacy-notice">
          <small>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            Your data will be securely stored and only used for neighborhood security purposes.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;