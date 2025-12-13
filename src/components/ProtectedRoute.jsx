import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingState from './ui/LoadingState'; // Assuming you have this, or use simple text

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // 1. Show a loading spinner while Supabase checks the session
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // 2. If not authenticated, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the child route (The Dashboard, etc.)
  return <Outlet />;
};

export default ProtectedRoute;