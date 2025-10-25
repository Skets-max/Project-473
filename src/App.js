import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifySuccess from './pages/Auth/VerifySuccess'; // ADD THIS IMPORT

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import Reports from './pages/Admin/Reports';
import Settings from './pages/Admin/Settings';

// Security Pages
import SecurityDashboard from './pages/Security/Dashboard';
import QRScanner from './pages/Security/QRScanner';
import PatrolHistory from './pages/Security/PatrolHistory';

// Member Pages
import MemberDashboard from './pages/Member/Dashboard';
import EmergencyAlert from './pages/Member/EmergencyAlert';
import CommunityForum from './pages/Member/CommunityForum';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-success" element={<VerifySuccess />} /> {/* ADD THIS ROUTE */}
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/manage-users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Security Routes */}
          <Route 
            path="/security/dashboard" 
            element={
              <ProtectedRoute requiredRole="security">
                <SecurityDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security/scan" 
            element={
              <ProtectedRoute requiredRole="security">
                <QRScanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security/patrol-history" 
            element={
              <ProtectedRoute requiredRole="security">
                <PatrolHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Member Routes */}
          <Route 
            path="/member/dashboard" 
            element={
              <ProtectedRoute requiredRole="member">
                <MemberDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member/emergency-alert" 
            element={
              <ProtectedRoute requiredRole="member">
                <EmergencyAlert />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member/community-forum" 
            element={
              <ProtectedRoute requiredRole="member">
                <CommunityForum />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;