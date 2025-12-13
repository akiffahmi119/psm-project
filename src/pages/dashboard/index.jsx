import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { logoutUser } from '../../store/authSlice';   // Import the actual logout action
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import KPICard from './components/KPICard';
import AssetStatusChart from './components/AssetStatusChart';
import AssetCategoryChart from './components/AssetCategoryChart';
import AssetTrendChart from './components/AssetTrendChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActions from './components/QuickActions';
import GlobalSearchBar from './components/GlobalSearchBar';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  
  // Get the Real User from Redux State
  const { user: authUser } = useSelector((state) => state.auth);

  // Create a display user object that merges Auth data with UI needs
  const user = {
    id: authUser?.id || 'guest',
    name: authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || "User",
    email: authUser?.email || "user@panasonic.com",
    role: authUser?.app_metadata?.role || "it_staff", // Assuming role is stored here, or default
    avatar: null, // You can add logic for avatars later
    avatarAlt: "User Avatar"
  };

  // Mock KPI data (Preserved your existing mock data for UI visualization)
  const kpiData = [
    {
      title: "Total Assets",
      value: "2,847",
      subtitle: "Active inventory",
      icon: "Package",
      trend: "up",
      trendValue: "+12%",
      color: "primary"
    },
    {
      title: "Assets in Use",
      value: "2,156",
      subtitle: "Currently deployed",
      icon: "CheckCircle",
      trend: "up",
      trendValue: "+5%",
      color: "success"
    },
    {
      title: "In Storage",
      value: "534",
      subtitle: "Available for deployment",
      icon: "Archive",
      trend: "down",
      trendValue: "-3%",
      color: "warning"
    },
    {
      title: "Expiring Soon",
      value: "157",
      subtitle: "Within 90 days",
      icon: "AlertTriangle",
      trend: "up",
      trendValue: "+8%",
      color: "error"
    }
  ];

  // Mock chart data (Preserved)
  const statusChartData = [
    { name: 'In Use', value: 2156, total: 2847 },
    { name: 'In Storage', value: 534, total: 2847 },
    { name: 'Under Repair', value: 89, total: 2847 },
    { name: 'Retired', value: 68, total: 2847 }
  ];

  const categoryChartData = [
    { category: 'Laptops', count: 856 },
    { category: 'Desktops', count: 423 },
    { category: 'Monitors', count: 672 },
    { category: 'Printers', count: 234 },
    { category: 'Network', count: 189 },
    { category: 'Servers', count: 156 },
    { category: 'Mobile', count: 317 }
  ];

  const trendChartData = [
    { month: 'May 2024', count: 45 },
    { month: 'Jun 2024', count: 67 },
    { month: 'Jul 2024', count: 89 },
    { month: 'Aug 2024', count: 123 },
    { month: 'Sep 2024', count: 156 },
    { month: 'Oct 2024', count: 178 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'asset_added',
      description: 'New Dell Laptop OptiPlex 7090 added to inventory',
      user: 'Michael Chen',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      assetId: 'AST-2847'
    },
    {
      id: 2,
      type: 'asset_checked_out',
      description: 'HP Monitor U2720Q checked out to Marketing Department',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      assetId: 'AST-1234'
    },
    {
      id: 3,
      type: 'maintenance_logged',
      description: 'Maintenance completed on Cisco Router ISR4331',
      user: 'David Rodriguez',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      assetId: 'AST-0987'
    },
    {
      id: 4,
      type: 'asset_updated',
      description: 'Asset location updated for Lenovo ThinkPad X1 Carbon',
      user: 'Emily Watson',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      assetId: 'AST-5678'
    },
    {
      id: 5,
      type: 'asset_checked_in',
      description: 'Canon Printer ImageCLASS returned from Finance Department',
      user: 'James Wilson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      assetId: 'AST-3456'
    },
    {
      id: 6,
      type: 'asset_retired',
      description: 'Old Dell Desktop OptiPlex 3070 marked as retired',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      assetId: 'AST-0123'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = () => {
    const newNotification = {
      id: Date.now(),
      message: "You have 3 assets expiring within the next 30 days",
      type: "warning",
      duration: 5000
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  // --- UPDATED LOGOUT LOGIC ---
  const handleProfileClick = async (action) => {
    const actions = {
      profile: () => console.log('Navigate to profile'),
      preferences: () => console.log('Navigate to preferences'),
      help: () => console.log('Navigate to help'),
      
      // The Critical Fix: Dispatch Redux Action
      logout: async () => {
        try {
          // 1. Notify user
          const notification = {
            id: Date.now(),
            message: "Logging out...",
            type: "info",
            duration: 1000
          };
          setNotifications((prev) => [...prev, notification]);

          // 2. Perform actual logout against Supabase
          await dispatch(logoutUser()).unwrap();
          
          // 3. Navigate to login (optional, as App.jsx listener usually handles this)
          navigate('/login');
          
        } catch (error) {
          console.error("Logout failed:", error);
          const errorNotification = {
            id: Date.now(),
            message: "Logout failed. Please try again.",
            type: "error",
            duration: 3000
          };
          setNotifications((prev) => [...prev, errorNotification]);
        }
      }
    };

    if (actions?.[action]) {
      actions?.[action]();
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notification) => notification?.id !== id));
  };

  const handleAddAsset = () => {
    navigate('/asset-registration');
  };

  const handleBulkImport = () => {
    navigate('/asset-registration?mode=bulk');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user} 
        />
        <Header
          user={user}
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick} 
        />
        <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
          <div className="p-6">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user} 
      />
      <Header
        user={user}
        onSearch={handleSearch}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick} 
      />

      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Asset Management Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your IT assets efficiently</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={handleBulkImport}>
                Bulk Import
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddAsset}>
                Add Asset
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <GlobalSearchBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) =>
              <KPICard key={index} {...kpi} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AssetStatusChart data={statusChartData} />
            <AssetCategoryChart data={categoryChartData} />
            <AssetTrendChart data={trendChartData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivityFeed activities={recentActivities} />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
      
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default Dashboard;