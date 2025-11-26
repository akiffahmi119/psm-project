import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingState';
import { NotificationContainer } from '../../components/ui/NotificationToast';

// Import components
import Breadcrumb from './components/Breadcrumb';
import AssetHeader from './components/AssetHeader';
import AssetTabs from './components/AssetTabs';
import DetailsTab from './components/DetailsTab';
import MaintenanceTab from './components/MaintenanceTab';
import AttachmentsTab from './components/AttachmentsTab';
import AuditTab from './components/AuditTab';
import QRCodeModal from './components/QRCodeModal';

const AssetDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);

  // Mock user data
  const user = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@panasonic.com",
    role: "it_staff",
    avatar: "https://images.unsplash.com/photo-1734991032476-bceab8383a59",
    avatarAlt: "Professional headshot of woman with shoulder-length brown hair in business attire"
  };

  // Mock asset data
  const [asset] = useState({
    id: "AST-2024-001",
    name: "Dell OptiPlex 7090 Desktop",
    category: "Desktop Computer",
    status: "In Use",
    location: "IT Department - Floor 3",
    department: "Information Technology",
    serialNumber: "DL7090-2024-001",
    model: "OptiPlex 7090",
    brand: "Dell",
    assetTag: "PAN-IT-001",
    assignedTo: "Michael Chen",
    assignmentDate: "2024-01-15",
    purchasePrice: 1299.99,
    purchaseDate: "2024-01-10",
    supplier: "Dell Technologies",
    purchaseOrder: "PO-2024-0001",
    warrantyExpiry: "2027-01-10",
    warrantyProvider: "Dell ProSupport",
    specifications: {
      processor: "Intel Core i7-11700",
      memory: "16GB DDR4",
      storage: "512GB NVMe SSD",
      graphics: "Intel UHD Graphics 750",
      operatingSystem: "Windows 11 Pro",
      networkCard: "Intel Ethernet Connection",
      ports: "USB 3.2, HDMI, DisplayPort"
    }
  });

  // Mock maintenance history
  const [maintenanceHistory] = useState([
  {
    id: 1,
    title: "Quarterly System Maintenance",
    type: "Preventive",
    date: "2024-10-01",
    cost: 75.00,
    technician: "David Rodriguez",
    description: "Performed routine system cleaning, updated drivers, and ran diagnostic tests. All components functioning within normal parameters.",
    partsReplaced: [],
    nextMaintenanceDate: "2025-01-01"
  },
  {
    id: 2,
    title: "Memory Upgrade",
    type: "Corrective",
    date: "2024-08-15",
    cost: 150.00,
    technician: "Lisa Wang",
    description: "Upgraded system memory from 8GB to 16GB DDR4 to improve performance for CAD applications.",
    partsReplaced: ["8GB DDR4 Module", "16GB DDR4 Module"],
    nextMaintenanceDate: null
  },
  {
    id: 3,
    title: "Emergency Power Supply Replacement",
    type: "Emergency",
    date: "2024-06-20",
    cost: 220.00,
    technician: "Robert Kim",
    description: "Replaced faulty power supply unit after system experienced unexpected shutdowns. Tested all components post-replacement.",
    partsReplaced: ["450W Power Supply Unit"],
    nextMaintenanceDate: null
  }]
  );

  // Mock attachments
  const [attachments] = useState([
  {
    id: 1,
    name: "Purchase_Invoice_AST-2024-001.pdf",
    size: 245760,
    uploadedAt: "2024-01-10T10:30:00Z",
    uploadedBy: "Sarah Johnson",
    description: "Original purchase invoice from Dell Technologies"
  },
  {
    id: 2,
    name: "Warranty_Certificate.pdf",
    size: 156432,
    uploadedAt: "2024-01-10T11:15:00Z",
    uploadedBy: "Sarah Johnson",
    description: "Dell ProSupport warranty certificate"
  },
  {
    id: 3,
    name: "System_Specifications.xlsx",
    size: 89123,
    uploadedAt: "2024-01-15T09:45:00Z",
    uploadedBy: "Michael Chen",
    description: "Detailed hardware and software specifications"
  },
  {
    id: 4,
    name: "Setup_Photos.zip",
    size: 2456789,
    uploadedAt: "2024-01-15T14:20:00Z",
    uploadedBy: "Michael Chen",
    description: "Photos of workstation setup and cable management"
  }]
  );

  // Mock audit trail
  const [auditTrail] = useState([
  {
    id: 1,
    action: "Created",
    timestamp: "2024-01-10T09:00:00Z",
    user: "Sarah Johnson",
    userRole: "IT Staff",
    description: "Asset record created in the system with initial specifications and purchase information.",
    ipAddress: "192.168.1.45",
    sessionId: "sess_abc123",
    deviceInfo: "Windows 11 - Chrome 118.0",
    changes: [
    { field: "Status", newValue: "In Storage", oldValue: null },
    { field: "Location", newValue: "IT Department - Floor 3", oldValue: null }]

  },
  {
    id: 2,
    action: "Assigned",
    timestamp: "2024-01-15T08:30:00Z",
    user: "Sarah Johnson",
    userRole: "IT Staff",
    description: "Asset assigned to Michael Chen for daily use in the Engineering Department.",
    ipAddress: "192.168.1.45",
    sessionId: "sess_def456",
    deviceInfo: "Windows 11 - Chrome 118.0",
    changes: [
    { field: "Status", oldValue: "In Storage", newValue: "In Use" },
    { field: "Assigned To", oldValue: null, newValue: "Michael Chen" },
    { field: "Assignment Date", oldValue: null, newValue: "2024-01-15" }]

  },
  {
    id: 3,
    action: "Maintenance",
    timestamp: "2024-06-20T14:15:00Z",
    user: "Robert Kim",
    userRole: "Technician",
    description: "Emergency maintenance performed - power supply unit replacement due to system failures.",
    ipAddress: "192.168.1.78",
    sessionId: "sess_ghi789",
    deviceInfo: "Windows 10 - Edge 115.0",
    changes: []
  },
  {
    id: 4,
    action: "Updated",
    timestamp: "2024-08-15T11:45:00Z",
    user: "Lisa Wang",
    userRole: "IT Staff",
    description: "System specifications updated following memory upgrade from 8GB to 16GB DDR4.",
    ipAddress: "192.168.1.52",
    sessionId: "sess_jkl012",
    deviceInfo: "macOS 14 - Safari 17.0",
    changes: [
    { field: "Memory", oldValue: "8GB DDR4", newValue: "16GB DDR4" }]

  },
  {
    id: 5,
    action: "Maintenance",
    timestamp: "2024-10-01T10:00:00Z",
    user: "David Rodriguez",
    userRole: "Technician",
    description: "Quarterly preventive maintenance completed - system cleaning and diagnostic tests performed.",
    ipAddress: "192.168.1.89",
    sessionId: "sess_mno345",
    deviceInfo: "Windows 11 - Firefox 119.0",
    changes: []
  }]
  );

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notification) => notification?.id !== id));
  };

  const handleEdit = () => {
    addNotification({
      type: 'info',
      message: 'Redirecting to asset edit form...'
    });
    setTimeout(() => {
      navigate('/asset-registration', { state: { editMode: true, asset } });
    }, 1000);
  };

  const handlePrintQR = () => {
    setShowQRModal(true);
  };

  const handleCheckOut = () => {
    const action = asset?.status === 'In Use' ? 'checked in' : 'checked out';
    addNotification({
      type: 'success',
      message: `Asset ${action} successfully!`
    });
  };

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = () => {
    addNotification({
      type: 'info',
      message: 'You have 3 new notifications'
    });
  };

  const handleProfileClick = (action) => {
    switch (action) {
      case 'profile':
        addNotification({
          type: 'info',
          message: 'Profile settings would open here'
        });
        break;
      case 'logout':
        addNotification({
          type: 'info',
          message: 'Logging out...'
        });
        setTimeout(() => navigate('/'), 1000);
        break;
      default:
        addNotification({
          type: 'info',
          message: `${action} feature coming soon`
        });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading asset details...</p>
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


      <main className={`transition-all duration-300 pt-16 ${
      isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`
      }>
        <div className="p-6">
          <Breadcrumb asset={asset} />
          
          <AssetHeader
            asset={asset}
            onEdit={handleEdit}
            onPrintQR={handlePrintQR}
            onCheckOut={handleCheckOut} />


          <AssetTabs defaultTab="details">
            <DetailsTab tabId="details" asset={asset} />
            <MaintenanceTab tabId="maintenance" maintenanceHistory={maintenanceHistory} />
            <AttachmentsTab tabId="attachments" attachments={attachments} />
            <AuditTab tabId="audit" auditTrail={auditTrail} />
          </AssetTabs>
        </div>
      </main>

      <QRCodeModal
        asset={asset}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)} />


      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default AssetDetails;