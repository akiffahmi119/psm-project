import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import Button from '../../components/ui/Button';
import CheckoutPanel from './components/CheckoutPanel';
import ActiveLoansPanel from './components/ActiveLoansPanel';
import AssetSelectionModal from './components/AssetSelectionModal';
import EmployeeSearchModal from './components/EmployeeSearchModal';
import CheckInModal from './components/CheckInModal';
import BarcodeScanner from './components/BarcodeScanner';
import FilterToolbar from './components/FilterToolbar';
import StatsCards from './components/StatsCards';

const CheckoutManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('active-loans');
  const [showAssetSelection, setShowAssetSelection] = useState(false);
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [checkInAsset, setCheckInAsset] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [filters, setFilters] = useState({
    employee: '',
    department: '',
    category: '',
    status: 'all',
    overdue: false
  });

  const navigate = useNavigate();

  // Mock user data
  const user = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@panasonic.com",
    role: "it_staff",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of woman with brown hair in white blazer smiling at camera"
  };

  // Mock statistics data
  const statsData = [
  {
    title: "Active Loans",
    value: "234",
    subtitle: "Currently checked out",
    icon: "Package",
    trend: "up",
    trendValue: "+12",
    color: "primary"
  },
  {
    title: "Available Assets",
    value: "156",
    subtitle: "Ready for checkout",
    icon: "CheckCircle",
    trend: "down",
    trendValue: "-5",
    color: "success"
  },
  {
    title: "Overdue Returns",
    value: "18",
    subtitle: "Past due date",
    icon: "AlertTriangle",
    trend: "up",
    trendValue: "+3",
    color: "error"
  },
  {
    title: "Due This Week",
    value: "42",
    subtitle: "Returns expected",
    icon: "Calendar",
    trend: "stable",
    trendValue: "0",
    color: "warning"
  }];


  // Mock active loans data
  const mockActiveLoans = [
  {
    id: 'LOAN-001',
    assetId: 'AST-12345',
    assetName: 'Dell Laptop OptiPlex 7090',
    assetCategory: 'Laptops',
    employee: {
      id: 'EMP-001',
      name: 'Michael Chen',
      department: 'Engineering',
      email: 'michael.chen@panasonic.com',
      avatar: "https://images.unsplash.com/photo-1698072556534-40ec6e337311",
      avatarAlt: 'Professional headshot of Asian man in blue shirt smiling'
    },
    checkoutDate: new Date('2024-10-15'),
    expectedReturnDate: new Date('2024-11-15'),
    status: 'active',
    urgency: 'normal',
    notes: 'For remote work setup'
  },
  {
    id: 'LOAN-002',
    assetId: 'AST-23456',
    assetName: 'HP Monitor U2720Q',
    assetCategory: 'Monitors',
    employee: {
      id: 'EMP-002',
      name: 'Emily Watson',
      department: 'Marketing',
      email: 'emily.watson@panasonic.com',
      avatar: "https://images.unsplash.com/photo-1728139877871-91d024a94f39",
      avatarAlt: 'Professional headshot of woman with blonde hair in white blouse'
    },
    checkoutDate: new Date('2024-10-01'),
    expectedReturnDate: new Date('2024-10-25'),
    status: 'overdue',
    urgency: 'high',
    notes: 'Conference room setup'
  }];


  // Mock available assets data
  const mockAvailableAssets = [
  {
    id: 'AST-34567',
    name: 'MacBook Pro 16"',
    category: 'Laptops',
    serialNumber: 'MBP-34567',
    location: 'Storage Room A',
    condition: 'Excellent',
    status: 'available',
    image: "https://images.unsplash.com/photo-1555449218-e3d347e35300",
    imageAlt: 'Silver MacBook Pro laptop opened on white desk'
  },
  {
    id: 'AST-45678',
    name: 'Logitech Webcam C920',
    category: 'Accessories',
    serialNumber: 'LGT-45678',
    location: 'Storage Room B',
    condition: 'Good',
    status: 'available',
    image: "https://images.unsplash.com/photo-1633410346394-141b2d37ae74",
    imageAlt: 'Black webcam device with adjustable clip mount'
  }];


  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setActiveLoans(mockActiveLoans);
      setAvailableAssets(mockAvailableAssets);
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
      message: "You have 3 assets overdue for return",
      type: "warning",
      duration: 5000
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const handleProfileClick = (action) => {
    const actions = {
      profile: () => console.log('Navigate to profile'),
      preferences: () => console.log('Navigate to preferences'),
      help: () => console.log('Navigate to help'),
      logout: () => {
        const notification = {
          id: Date.now(),
          message: "Successfully logged out",
          type: "success",
          duration: 3000
        };
        setNotifications((prev) => [...prev, notification]);
        setTimeout(() => navigate('/login'), 1000);
      }
    };

    if (actions?.[action]) {
      actions?.[action]();
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notification) => notification?.id !== id));
  };

  const handleStartCheckout = () => {
    setShowAssetSelection(true);
  };

  const handleAssetSelected = (asset) => {
    setSelectedAsset(asset);
    setShowAssetSelection(false);
    setShowEmployeeSearch(true);
  };

  const handleEmployeeSelected = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeSearch(false);

    // Process checkout
    const newLoan = {
      id: `LOAN-${Date.now()}`,
      assetId: selectedAsset?.id,
      assetName: selectedAsset?.name,
      assetCategory: selectedAsset?.category,
      employee: employee,
      checkoutDate: new Date(),
      expectedReturnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'active',
      urgency: 'normal',
      notes: ''
    };

    setActiveLoans((prev) => [newLoan, ...prev]);
    setAvailableAssets((prev) => prev?.filter((asset) => asset?.id !== selectedAsset?.id));

    const notification = {
      id: Date.now(),
      message: `Asset ${selectedAsset?.name} checked out to ${employee?.name}`,
      type: "success",
      duration: 4000
    };
    setNotifications((prev) => [...prev, notification]);

    // Reset selections
    setSelectedAsset(null);
    setSelectedEmployee(null);
  };

  const handleCheckIn = (loan) => {
    setCheckInAsset(loan);
    setShowCheckInModal(true);
  };

  const handleCheckInComplete = (loanId, condition, notes) => {
    const loan = activeLoans?.find((l) => l?.id === loanId);
    if (loan) {
      // Move asset back to available
      const returnedAsset = {
        id: loan?.assetId,
        name: loan?.assetName,
        category: loan?.assetCategory,
        serialNumber: loan?.assetId,
        location: 'Storage Room A',
        condition: condition,
        status: 'available'
      };

      setAvailableAssets((prev) => [returnedAsset, ...prev]);
      setActiveLoans((prev) => prev?.filter((l) => l?.id !== loanId));

      const notification = {
        id: Date.now(),
        message: `Asset ${loan?.assetName} successfully returned`,
        type: "success",
        duration: 4000
      };
      setNotifications((prev) => [...prev, notification]);
    }

    setShowCheckInModal(false);
    setCheckInAsset(null);
  };

  const handleBarcodeScanned = (barcode) => {
    // Find asset by barcode/serial number
    const asset = availableAssets?.find((a) => a?.serialNumber === barcode || a?.id === barcode);
    const loan = activeLoans?.find((l) => l?.assetId === barcode || l?.id === barcode);

    if (asset) {
      handleAssetSelected(asset);
    } else if (loan) {
      handleCheckIn(loan);
    } else {
      const notification = {
        id: Date.now(),
        message: `No asset found with barcode: ${barcode}`,
        type: "error",
        duration: 4000
      };
      setNotifications((prev) => [...prev, notification]);
    }

    setShowBarcodeScanner(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBulkOperation = (operation, selectedItems) => {
    const notification = {
      id: Date.now(),
      message: `Bulk ${operation} completed for ${selectedItems?.length} items`,
      type: "success",
      duration: 4000
    };
    setNotifications((prev) => [...prev, notification]);
  };

  if (isLoading) {
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
          <div className="p-6">
            <DashboardSkeleton />
          </div>
        </main>
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
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Checkout Management</h1>
              <p className="text-muted-foreground">Manage equipment loans and track asset assignments</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                iconName="Scan"
                iconPosition="left"
                onClick={() => setShowBarcodeScanner(true)}>

                Scan Barcode
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleStartCheckout}>

                New Checkout
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <StatsCards data={statsData} />

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            onBulkOperation={handleBulkOperation} />


          {/* Tab Navigation */}
          <div className="bg-card rounded-lg border border-border">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('active-loans')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'active-loans' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`
                  }>

                  <span className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {activeLoans?.length || 0}
                    </span>
                    Active Loans
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('available-assets')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'available-assets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`
                  }>

                  <span className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/10 text-success text-xs font-bold">
                      {availableAssets?.length || 0}
                    </span>
                    Available Assets
                  </span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'active-loans' ?
              <ActiveLoansPanel
                loans={activeLoans}
                filters={filters}
                onCheckIn={handleCheckIn}
                onBulkOperation={handleBulkOperation} /> :


              <CheckoutPanel
                assets={availableAssets}
                filters={filters}
                onAssetSelect={handleAssetSelected}
                onBulkOperation={handleBulkOperation} />

              }
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAssetSelection &&
      <AssetSelectionModal
        assets={availableAssets}
        onAssetSelect={handleAssetSelected}
        onClose={() => setShowAssetSelection(false)} />

      }

      {showEmployeeSearch &&
      <EmployeeSearchModal
        onEmployeeSelect={handleEmployeeSelected}
        onClose={() => {
          setShowEmployeeSearch(false);
          setSelectedAsset(null);
        }} />

      }

      {showCheckInModal && checkInAsset &&
      <CheckInModal
        loan={checkInAsset}
        onCheckIn={handleCheckInComplete}
        onClose={() => {
          setShowCheckInModal(false);
          setCheckInAsset(null);
        }} />

      }

      {showBarcodeScanner &&
      <BarcodeScanner
        onBarcodeScanned={handleBarcodeScanned}
        onClose={() => setShowBarcodeScanner(false)} />

      }

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default CheckoutManagement;