import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { LoadingSpinner } from '../../components/ui/LoadingState';
import DateRangeSelector from './components/DateRangeSelector';
import CategoryFilter from './components/CategoryFilter';
import TimelineChart from './components/TimelineChart';
import BudgetSummary from './components/BudgetSummary';
import ForecastTable from './components/ForecastTable';
import ScenarioPlanning from './components/ScenarioPlanning';
import Button from '../../components/ui/Button';


const LifecyclePlanning = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date()?.toISOString()?.split('T')?.[0],
    endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
    range: '6months'
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeScenario, setActiveScenario] = useState(null);

  // Mock user data
  const user = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@panasonic.com",
    role: "it_staff",
    avatar: "https://images.unsplash.com/photo-1734991032476-bceab8383a59",
    avatarAlt: "Professional headshot of woman with shoulder-length brown hair in business attire"
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = () => {
    addNotification('Notifications panel opened', 'info');
  };

  const handleProfileClick = (action) => {
    switch (action) {
      case 'profile':
        addNotification('Profile settings opened', 'info');
        break;
      case 'preferences':
        addNotification('Preferences updated', 'success');
        break;
      case 'help':
        addNotification('Help documentation opened', 'info');
        break;
      case 'logout':
        addNotification('Logged out successfully', 'success');
        navigate('/');
        break;
      default:
        break;
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notif) => notif?.id !== id));
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    addNotification(`Planning period updated to ${dateRange?.range}`, 'success');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    addNotification(`Filter updated: ${category === 'all' ? 'All categories' : category}`, 'info');
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    addNotification(`Filter updated: ${department === 'all' ? 'All departments' : department}`, 'info');
  };

  const handleScenarioChange = (scenario) => {
    setActiveScenario(scenario);
    addNotification(`Scenario applied: ${scenario?.name}`, 'success');
  };

  const handleExportForecast = () => {
    // Mock export functionality
    addNotification('Forecast data exported successfully', 'success');
  };

  const handleCreateProcurementPlan = () => {
    addNotification('Procurement plan creation started', 'info');
    // Navigate to procurement planning (mock)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-muted-foreground">Loading lifecycle planning data...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user} />

      
      <Header
        user={user}
        onSearch={handleSearch}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick} />


      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lifecycle Planning</h1>
              <p className="text-muted-foreground">
                Asset replacement forecasting and budget planning analytics
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="FileText"
                onClick={handleCreateProcurementPlan}>

                Create Procurement Plan
              </Button>
              <Button
                variant="default"
                iconName="Download"
                onClick={handleExportForecast}>

                Export Forecast
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            <DateRangeSelector
              onDateRangeChange={handleDateRangeChange}
              selectedRange={selectedDateRange} />

            
            <CategoryFilter
              selectedCategories={selectedCategory}
              onCategoryChange={handleCategoryChange}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={handleDepartmentChange} />

          </div>

          {/* Timeline Chart */}
          <TimelineChart
            data={[]}
            selectedRange={selectedDateRange} />


          {/* Budget Summary */}
          <BudgetSummary
            dateRange={selectedDateRange} />


          {/* Scenario Planning */}
          <ScenarioPlanning
            onScenarioChange={handleScenarioChange} />


          {/* Forecast Table */}
          <ForecastTable
            filters={{
              category: selectedCategory,
              department: selectedDepartment,
              dateRange: selectedDateRange
            }} />


          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                iconName="Plus"
                onClick={() => navigate('/asset-registration')}
                className="justify-start h-auto p-4">

                <div className="text-left">
                  <div className="font-medium">Register New Asset</div>
                  <div className="text-sm text-muted-foreground">Add assets to the system</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                iconName="BarChart3"
                onClick={() => navigate('/dashboard')}
                className="justify-start h-auto p-4">

                <div className="text-left">
                  <div className="font-medium">View Dashboard</div>
                  <div className="text-sm text-muted-foreground">Asset overview and KPIs</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                iconName="Package"
                onClick={() => navigate('/asset-list')}
                className="justify-start h-auto p-4">

                <div className="text-left">
                  <div className="font-medium">Browse Assets</div>
                  <div className="text-sm text-muted-foreground">View all registered assets</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default LifecyclePlanning;