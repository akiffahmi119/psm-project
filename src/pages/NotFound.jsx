import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import Sidebar from 'components/ui/Sidebar';
import Header from 'components/ui/Header';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get actual user from Redux store
  const { user } = useSelector((state) => state.auth);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} user={user} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header user={user} />
        
        <main className="pt-16 p-6">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto pt-20">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
              </div>
            </div>

            <h2 className="text-2xl font-medium text-onBackground mb-2">Page Not Found</h2>
            <p className="text-onBackground/70 mb-8">
              The page you're looking for doesn't exist. Let's get you back!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                icon={<Icon name="ArrowLeft" />}
                iconPosition="left"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>

              <Button
                variant="outline"
                icon={<Icon name="Home" />}
                iconPosition="left"
                onClick={handleGoHome}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFound;