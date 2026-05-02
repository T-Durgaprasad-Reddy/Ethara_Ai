import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'} />;
  }

  return children;
};

export default ProtectedRoute;
