import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = authService.getCurrentUser();
  
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;