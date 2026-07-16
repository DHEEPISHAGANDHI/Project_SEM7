import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallback = null 
}) => {
  const { isAuthenticated, user, hasRole, hasPermission, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '1.1rem',
        color: '#667eea'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        Checking authentication...
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return fallback || (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#6b7280'
      }}>
        <i className="fas fa-lock" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
        <h3>Authentication Required</h3>
        <p>Please log in to access this content.</p>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#dc2626'
      }}>
        <i className="fas fa-ban" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
        <h3>Access Denied</h3>
        <p>You don't have permission to access this content.</p>
        <p>Required role: <strong>{requiredRole}</strong></p>
        <p>Your role: <strong>{user?.role}</strong></p>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#dc2626'
      }}>
        <i className="fas fa-ban" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
        <h3>Access Denied</h3>
        <p>You don't have the required permission to access this content.</p>
        <p>Required permission: <strong>{requiredPermission}</strong></p>
      </div>
    );
  }

  // User has access, render children
  return children;
};

export default ProtectedRoute;
