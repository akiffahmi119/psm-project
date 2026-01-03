import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingState from './ui/LoadingState'; 

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
    const location = useLocation();

    // 1. Loading State: Wait for Supabase to tell us who the user is
    if (loading) {
        return <LoadingState />; 
    }

    // 2. Authentication Check: Are they logged in?
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 3. Authorization Check: Do they have the right Role?
    const userRole = user?.role;
    const isRoleRequired = allowedRoles && allowedRoles.length > 0;
    
    // If we require specific roles (e.g. 'system_admin') but the user data says 'authenticated'
    // or is missing the role, we block access.
    const isAuthorized = !isRoleRequired || (userRole && allowedRoles.includes(userRole));



    if (isAuthorized) {
        return <Outlet />;
    } else {
        // Access Denied Screen (Instead of infinite loop)
        return (
             <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-900">
                 <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center border border-gray-200">
                     <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                     <p className="mb-6 text-gray-600">
                         Your role <strong>"{userRole || 'Unknown'}"</strong> is not authorized to view this page.
                     </p>
                     <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                     >
                        Return to Dashboard
                     </button>
                 </div>
             </div>
        );
    }
};

export default ProtectedRoute;