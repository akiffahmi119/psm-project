import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState({ name: 'User', role: 'it_staff' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hydrateUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Only redirect if NOT already on login page (prevents loops)
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    hydrateUser();
  }, [navigate, location]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        user={user} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} collapsed={isSidebarCollapsed} />
        <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 flex-1 overflow-y-auto`}>
          
          {/* THIS IS KEY: Passing the user object to children */}
          <Outlet context={{ user }} /> 
          
        </main>
      </div>
    </div>
  );
};

export default MainLayout;