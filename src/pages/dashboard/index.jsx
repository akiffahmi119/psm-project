import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { supabase } from '../../lib/supabaseClient'; // 1. Import Supabase
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
  
  // 2. New State for Real Data
  const [realStats, setRealStats] = useState({
      totalAssets: 0,
      inUseCount: 0,
      inStorageCount: 0,
      expiringCount: 0,
      assetsByStatus: [],
      assetsByCategory: [],
      recentAssets: []
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user: authUser } = useSelector((state) => state.auth);

  const user = {
    id: authUser?.id || 'guest',
    name: authUser?.full_name || authUser?.email?.split('@')[0] || "User", // Use full_name from profile if available
    email: authUser?.email || "user@panasonic.com",
    role: authUser?.role || "it_staff",
    avatar: null,
    avatarAlt: "User Avatar"
  };

  // 3. FETCH REAL DATA FROM SUPABASE
  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            // Fetch all assets
            const { data: assets, error } = await supabase
                .from('assets')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // --- CALCULATIONS ---
            const totalAssets = assets.length;
            const inUseCount = assets.filter(a => a.status === 'In Use').length;
            const inStorageCount = assets.filter(a => a.status === 'In Storage').length;
            
            // Dummy logic for "Expiring Soon" (since we might not have warranty dates set perfectly yet)
            // In a real scenario, compare 'warranty_months' + 'purchase_date' vs Today
            const expiringCount = 0; 

            // Group for Status Chart
            const statusMap = assets.reduce((acc, curr) => {
                acc[curr.status] = (acc[curr.status] || 0) + 1;
                return acc;
            }, {});
            const assetsByStatus = Object.keys(statusMap).map(key => ({ 
                name: key, 
                value: statusMap[key],
                total: totalAssets // Keep your component's expected format
            }));

            // Group for Category Chart
            const categoryMap = assets.reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + 1;
                return acc;
            }, {});
            const assetsByCategory = Object.keys(categoryMap).map(key => ({ 
                category: key, 
                count: categoryMap[key] 
            }));

            // Map Recent Activity (using newly added assets)
            const recentAssets = assets.slice(0, 5).map(asset => ({
                id: asset.id,
                type: 'asset_added', // For now, we only track additions
                description: `New ${asset.product_name} (${asset.category})`,
                user: 'System Admin', // Placeholder until we track creator_id
                timestamp: new Date(asset.created_at),
                assetId: asset.asset_tag
            }));

            setRealStats({
                totalAssets,
                inUseCount,
                inStorageCount,
                expiringCount,
                assetsByStatus,
                assetsByCategory,
                recentAssets
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Optionally set a notification error here
        } finally {
            setIsLoading(false);
        }
    };

    fetchDashboardData();
  }, []);


  // 4. MAP REAL DATA TO YOUR UI PROPS

  // Replaced Mock KPI Data with Real Stats
  const kpiData = [
    {
      title: "Total Assets",
      value: realStats.totalAssets.toLocaleString(),
      subtitle: "Active inventory",
      icon: "Package",
      trend: "up", // Logic for trends requires historical data, keeping static for now
      trendValue: "+0%",
      color: "primary"
    },
    {
      title: "Assets in Use",
      value: realStats.inUseCount.toLocaleString(),
      subtitle: "Currently deployed",
      icon: "CheckCircle",
      trend: "up",
      trendValue: "+0%",
      color: "success"
    },
    {
      title: "In Storage",
      value: realStats.inStorageCount.toLocaleString(),
      subtitle: "Available for deployment",
      icon: "Archive",
      trend: "down",
      trendValue: "-0%",
      color: "warning"
    },
    {
      title: "Expiring Soon",
      value: realStats.expiringCount.toLocaleString(),
      subtitle: "Within 90 days",
      icon: "AlertTriangle",
      trend: "up",
      trendValue: "+0%",
      color: "error"
    }
  ];

  // Keep Trend Data Mocked for now (until we have months of data)
  const trendChartData = [
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: realStats.totalAssets } // Show current total at end
  ];

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = () => {
    const newNotification = {
      id: Date.now(),
      message: "System notification test.",
      type: "info",
      duration: 3000
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const handleProfileClick = async (action) => {
    const actions = {
      profile: () => console.log('Navigate to profile'),
      preferences: () => console.log('Navigate to preferences'),
      help: () => console.log('Navigate to help'),
      logout: async () => {
        try {
          const notification = {
            id: Date.now(),
            message: "Logging out...",
            type: "info",
            duration: 1000
          };
          setNotifications((prev) => [...prev, notification]);
          await dispatch(logoutUser()).unwrap();
          navigate('/login');
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    };
    if (actions?.[action]) actions?.[action]();
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notification) => notification?.id !== id));
  };

  const handleAddAsset = () => navigate('/asset-registration');
  const handleBulkImport = () => navigate('/asset-registration?mode=bulk');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user} 
        />
        <Header user={user} />
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
              <Button variant="outline" iconName="Upload" onClick={handleBulkImport}>
                Bulk Import
              </Button>
              <Button variant="default" iconName="Plus" onClick={handleAddAsset}>
                Add Asset
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <GlobalSearchBar />
          </div>

          {/* KPI Cards using Real Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) =>
              <KPICard key={index} {...kpi} />
            )}
          </div>

          {/* Charts using Real Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AssetStatusChart data={realStats.assetsByStatus} />
            <AssetCategoryChart data={realStats.assetsByCategory} />
            <AssetTrendChart data={trendChartData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Recent Activity using Real Data */}
              <RecentActivityFeed activities={realStats.recentAssets} />
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