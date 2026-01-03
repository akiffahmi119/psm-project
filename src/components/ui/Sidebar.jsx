import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // UPDATED: Corrected role names to match database ('system_admin')
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['system_admin', 'it_staff', 'department_pic'] // Changed 'admin' to 'system_admin'
    },
    {
      label: 'Search',
      path: '/search-results',
      icon: 'Search',
      roles: ['system_admin', 'it_staff', 'department_pic']
    },
    {
      label: 'Asset List',
      path: '/asset-list',
      icon: 'Package',
      roles: ['system_admin', 'it_staff', 'department_pic']
    },
    {
      label: 'Add Asset',
      path: '/asset-registration',
      icon: 'Plus',
      roles: ['system_admin', 'it_staff'] // Changed 'admin' to 'system_admin'
    },
    { 
    
      label: 'Checkout Management',
      path: '/checkout-management',
      icon: 'UserCheck',
      roles: ['system_admin', 'it_staff']
    },
    {
      label: 'Supplier Management',
      path: '/supplier-management',
      icon: 'Truck',
      roles: ['system_admin', 'it_staff']
    },
    {
      label: 'Lifecycle Planning',
      path: '/lifecycle-planning',
      icon: 'TrendingUp',
      roles: ['system_admin', 'it_staff']
    },
    {
      label: 'User Registration',
      path: '/admin/user-registration',
      icon: 'Users', // Assuming 'Users' is a valid icon
      roles: ['system_admin']
    },
    {
      label: 'Employee Management',
      path: '/admin/employee-management',
      icon: 'Users', // Assuming 'Users' is a valid icon
      roles: ['system_admin']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Improved filtering: if user role is missing, default to showing nothing to be safe
  const filteredNavItems = navigationItems?.filter(item => {
    const userRole = user?.role || user?.app_metadata?.role;
    // Show item if user has one of the allowed roles
    return item.roles.includes(userRole);
  });

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location?.pathname === '/' || location?.pathname === '/dashboard';
    }
    return location?.pathname?.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-200 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        iconName="Menu"
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-250 lg:hidden text-foreground"
      />
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-border z-200
        transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-60'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-6'} py-4 border-b border-border`}>
            {isCollapsed ? (
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm">
                P
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm">
                  P
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">Panasonic ISD</div>
                  <div className="text-xs text-muted-foreground">Asset Management</div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <div className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
              {filteredNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150 group
                    ${isActive(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item?.label : undefined}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={`flex-shrink-0 ${
                      isActive(item?.path) ? 'text-primary-foreground' : ''
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item?.label}</span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className={`border-t border-border p-4 ${isCollapsed ? 'px-2' : ''}`}>
            {isCollapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.role === 'system_admin' ? 'System Admin' : user?.role || 'IT Staff'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle (Desktop Only) */}
          {!isMobileOpen && (
            <div className={`hidden lg:block border-t border-border p-2`}>
              <Button
                variant="ghost"
                size="icon"
                iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
                onClick={onToggleCollapse}
                className="w-full text-muted-foreground hover:text-foreground"
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;