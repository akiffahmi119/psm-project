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

  const [asset, setAsset] = useState(null);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) {
        setIsLoading(false);
        addNotification({ type: 'error', message: 'No asset ID provided.' });
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*, department:departments(name), supplier:suppliers(name), assigned_to:employees(full_name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          const formattedAsset = {
            ...data,
            location_name: data.department?.name || 'N/A',
            supplier_name: data.supplier?.name || 'N/A',
            assigned_to_name: data.assigned_to?.full_name || 'Unassigned',
          };
          setAsset(formattedAsset);
        } else {
          addNotification({ type: 'error', message: `Asset with ID ${id} not found.` });
        }
      } catch (error) {
        console.error("Error fetching asset details:", error);
        addNotification({ type: 'error', message: 'Failed to fetch asset details.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

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