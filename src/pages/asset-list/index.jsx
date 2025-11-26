import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { TableSkeleton } from '../../components/ui/LoadingState';
import FilterToolbar from './components/FilterToolbar';
import AssetTable from './components/AssetTable';
import QuickViewPanel from './components/QuickViewPanel';
import QRCodeModal from './components/QRCodeModal';
import BulkActionModal from './components/BulkActionModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const AssetListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Asset data and filtering
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ column: 'lastUpdated', direction: 'desc' });

  // Modal states
  const [quickViewAsset, setQuickViewAsset] = useState(null);
  const [qrCodeAsset, setQRCodeAsset] = useState(null);
  const [bulkActionModal, setBulkActionModal] = useState({ isOpen: false, actionType: null });

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@panasonic.com",
    role: "it_staff"
  };

  // Mock assets data
  const mockAssets = [
  {
    id: 1,
    assetId: "PAN-LT-001",
    name: "ThinkPad X1 Carbon",
    model: "Lenovo ThinkPad X1 Carbon Gen 9",
    category: "laptop",
    status: "in_use",
    location: "HQ - Floor 2",
    serialNumber: "PC-123456",
    purchaseDate: "2023-03-15",
    purchaseCost: 1899.99,
    warrantyExpiry: "2026-03-15",
    lastUpdated: "2024-10-15T10:30:00Z",
    image: "https://images.unsplash.com/photo-1735344221079-2924eb70eafe",
    imageAlt: "Black ThinkPad laptop open on white desk showing screen and keyboard",
    assignedTo: {
      name: "John Doe",
      department: "IT Department",
      email: "john.doe@panasonic.com",
      assignedDate: "2024-09-01"
    },
    specifications: {
      processor: "Intel Core i7-1165G7",
      memory: "16GB LPDDR4x",
      storage: "512GB SSD",
      display: "14-inch 2K IPS"
    },
    recentActivity: [
    {
      action: "Asset assigned to John Doe",
      date: "2024-09-01T09:00:00Z",
      user: "Sarah Johnson"
    },
    {
      action: "Location updated to HQ - Floor 2",
      date: "2024-08-28T14:30:00Z",
      user: "Mike Wilson"
    }]

  },
  {
    id: 2,
    assetId: "PAN-DT-002",
    name: "OptiPlex 7090",
    model: "Dell OptiPlex 7090 Tower",
    category: "desktop",
    status: "in_storage",
    location: "Warehouse",
    serialNumber: "DT-789012",
    purchaseDate: "2023-01-20",
    purchaseCost: 1299.99,
    warrantyExpiry: "2026-01-20",
    lastUpdated: "2024-10-12T16:45:00Z",
    image: "https://images.unsplash.com/photo-1625469312270-84092c6c0268",
    imageAlt: "Silver desktop computer tower with black accents on white background",
    specifications: {
      processor: "Intel Core i5-11500",
      memory: "8GB DDR4",
      storage: "256GB SSD + 1TB HDD",
      graphics: "Intel UHD Graphics 750"
    },
    recentActivity: [
    {
      action: "Moved to warehouse storage",
      date: "2024-10-12T16:45:00Z",
      user: "David Brown"
    }]

  },
  {
    id: 3,
    assetId: "PAN-MN-003",
    name: "UltraSharp U2720Q",
    model: "Dell UltraSharp U2720Q 27-inch 4K",
    category: "monitor",
    status: "in_use",
    location: "HQ - Floor 1",
    serialNumber: "MN-345678",
    purchaseDate: "2023-05-10",
    purchaseCost: 649.99,
    warrantyExpiry: "2026-05-10",
    lastUpdated: "2024-10-10T11:20:00Z",
    image: "https://images.unsplash.com/photo-1674083401514-7a982e16e69f",
    imageAlt: "Large black computer monitor displaying colorful desktop wallpaper on modern desk",
    assignedTo: {
      name: "Jane Smith",
      department: "Finance Department",
      email: "jane.smith@panasonic.com",
      assignedDate: "2024-08-15"
    },
    specifications: {
      screenSize: "27 inches",
      resolution: "3840 x 2160 (4K UHD)",
      panelType: "IPS",
      connectivity: "USB-C, HDMI, DisplayPort"
    },
    recentActivity: [
    {
      action: "Assigned to Jane Smith",
      date: "2024-08-15T10:00:00Z",
      user: "Sarah Johnson"
    }]

  },
  {
    id: 4,
    assetId: "PAN-PR-004",
    name: "LaserJet Pro M404n",
    model: "HP LaserJet Pro M404n",
    category: "printer",
    status: "under_repair",
    location: "HQ - Floor 3",
    serialNumber: "PR-901234",
    purchaseDate: "2022-11-08",
    purchaseCost: 299.99,
    warrantyExpiry: "2025-11-08",
    lastUpdated: "2024-10-08T09:15:00Z",
    image: "https://images.unsplash.com/photo-1447283393583-22f128546e51",
    imageAlt: "White office laser printer with paper tray extended on gray background",
    specifications: {
      printSpeed: "38 ppm",
      printResolution: "1200 x 1200 dpi",
      paperCapacity: "250 sheets",
      connectivity: "Ethernet, USB"
    },
    recentActivity: [
    {
      action: "Sent for repair - paper jam issue",
      date: "2024-10-08T09:15:00Z",
      user: "Mike Wilson"
    },
    {
      action: "Maintenance check completed",
      date: "2024-09-20T14:00:00Z",
      user: "Tech Support"
    }]

  },
  {
    id: 5,
    assetId: "PAN-MB-005",
    name: "iPhone 14 Pro",
    model: "Apple iPhone 14 Pro 256GB",
    category: "mobile",
    status: "in_use",
    location: "Remote/Home Office",
    serialNumber: "MB-567890",
    purchaseDate: "2023-09-25",
    purchaseCost: 1099.99,
    warrantyExpiry: "2024-09-25",
    lastUpdated: "2024-10-05T13:30:00Z",
    image: "https://images.unsplash.com/photo-1605248064528-0091e98ef0a8",
    imageAlt: "Space black iPhone displaying home screen with colorful app icons",
    assignedTo: {
      name: "Mike Johnson",
      department: "Marketing Department",
      email: "mike.johnson@panasonic.com",
      assignedDate: "2024-07-01"
    },
    specifications: {
      storage: "256GB",
      display: "6.1-inch Super Retina XDR",
      camera: "48MP Main + 12MP Ultra Wide",
      connectivity: "5G, Wi-Fi 6, Bluetooth 5.3"
    },
    recentActivity: [
    {
      action: "Location updated to Remote/Home Office",
      date: "2024-10-05T13:30:00Z",
      user: "Mike Johnson"
    }]

  },
  {
    id: 6,
    assetId: "PAN-TB-006",
    name: "iPad Pro 12.9",
    model: "Apple iPad Pro 12.9-inch (6th gen)",
    category: "tablet",
    status: "retired",
    location: "Warehouse",
    serialNumber: "TB-123789",
    purchaseDate: "2021-05-15",
    purchaseCost: 1299.99,
    warrantyExpiry: "2023-05-15",
    lastUpdated: "2024-09-30T16:00:00Z",
    image: "https://images.unsplash.com/photo-1629641754659-51576a8b6a03",
    imageAlt: "Silver iPad Pro tablet displaying colorful interface on white surface with Apple Pencil nearby",
    specifications: {
      storage: "512GB",
      display: "12.9-inch Liquid Retina XDR",
      processor: "Apple M1 chip",
      connectivity: "Wi-Fi 6, Bluetooth 5.0"
    },
    recentActivity: [
    {
      action: "Asset retired due to age",
      date: "2024-09-30T16:00:00Z",
      user: "Sarah Johnson"
    }]

  },
  {
    id: 7,
    assetId: "PAN-SV-007",
    name: "PowerEdge R740",
    model: "Dell PowerEdge R740 Server",
    category: "server",
    status: "in_use",
    location: "HQ - Server Room",
    serialNumber: "SV-456123",
    purchaseDate: "2022-08-12",
    purchaseCost: 4999.99,
    warrantyExpiry: "2025-08-12",
    lastUpdated: "2024-10-01T08:00:00Z",
    image: "https://images.unsplash.com/photo-1554220170-a389aff2a0c3",
    imageAlt: "Black rack-mounted server with blue LED indicators in data center environment",
    specifications: {
      processor: "2x Intel Xeon Silver 4214R",
      memory: "64GB DDR4 ECC",
      storage: "4x 2TB SAS HDDs",
      networkPorts: "4x 1GbE"
    },
    recentActivity: [
    {
      action: "Monthly maintenance completed",
      date: "2024-10-01T08:00:00Z",
      user: "IT Infrastructure Team"
    }]

  },
  {
    id: 8,
    assetId: "PAN-NW-008",
    name: "Catalyst 9300 Switch",
    model: "Cisco Catalyst 9300-48P",
    category: "network",
    status: "in_use",
    location: "HQ - Network Closet",
    serialNumber: "NW-789456",
    purchaseDate: "2023-02-28",
    purchaseCost: 3299.99,
    warrantyExpiry: "2026-02-28",
    lastUpdated: "2024-09-28T12:45:00Z",
    image: "https://images.unsplash.com/photo-1561575130-7528293c5b13",
    imageAlt: "Black network switch with multiple ethernet ports and LED status indicators mounted in rack",
    specifications: {
      ports: "48x 1GbE + 4x 10GbE SFP+",
      switchingCapacity: "176 Gbps",
      forwardingRate: "130.95 Mpps",
      powerConsumption: "195W"
    },
    recentActivity: [
    {
      action: "Firmware updated to latest version",
      date: "2024-09-28T12:45:00Z",
      user: "Network Admin"
    }]

  }];


  useEffect(() => {
    // Simulate loading
    const loadAssets = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAssets(mockAssets);
      setFilteredAssets(mockAssets);
      setIsLoading(false);
    };

    loadAssets();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...assets];

    // Apply sorting
    if (sortConfig?.column) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.column];
        let bValue = b?.[sortConfig?.column];

        // Handle date sorting
        if (sortConfig?.column === 'lastUpdated' || sortConfig?.column === 'purchaseDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredAssets(filtered);
  }, [assets, sortConfig]);

  const handleFilterChange = (filters) => {
    let filtered = [...assets];

    // Apply category filter
    if (filters?.category) {
      filtered = filtered?.filter((asset) => asset?.category === filters?.category);
    }

    // Apply status filter
    if (filters?.status && filters?.status?.length > 0) {
      filtered = filtered?.filter((asset) => filters?.status?.includes(asset?.status));
    }

    // Apply location filter
    if (filters?.location) {
      filtered = filtered?.filter((asset) => asset?.location === filters?.location);
    }

    // Apply date range filter
    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      filtered = filtered?.filter((asset) => {
        const assetDate = new Date(asset.lastUpdated);
        const startDate = filters?.dateRange?.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters?.dateRange?.end ? new Date(filters.dateRange.end) : null;

        if (startDate && assetDate < startDate) return false;
        if (endDate && assetDate > endDate) return false;
        return true;
      });
    }

    setFilteredAssets(filtered);
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedAssets(selectedIds);
  };

  const handleQuickView = (asset) => {
    setQuickViewAsset(asset);
  };

  const handleEdit = (asset) => {
    navigate(`/asset-details?id=${asset?.id}&mode=edit`);
  };

  const handlePrintQR = (asset) => {
    setQRCodeAsset(asset);
  };

  const handleBulkAction = (actionType) => {
    if (selectedAssets?.length === 0) {
      addNotification('Please select at least one asset', 'warning');
      return;
    }

    setBulkActionModal({
      isOpen: true,
      actionType
    });
  };

  const handleBulkActionConfirm = (actionData) => {
    // Simulate bulk action processing
    const { actionType, selectedAssets: assetIds, formData } = actionData;

    let message = '';
    switch (actionType) {
      case 'update_status':
        message = `Status updated for ${assetIds?.length} asset${assetIds?.length > 1 ? 's' : ''}`;
        break;
      case 'transfer_location':
        message = `Location updated for ${assetIds?.length} asset${assetIds?.length > 1 ? 's' : ''}`;
        break;
      case 'assign_user':
        message = `${assetIds?.length} asset${assetIds?.length > 1 ? 's' : ''} assigned successfully`;
        break;
      case 'generate_qr':
        message = `QR codes generated for ${assetIds?.length} asset${assetIds?.length > 1 ? 's' : ''}`;
        break;
      case 'export_selected':
        message = `${assetIds?.length} asset${assetIds?.length > 1 ? 's' : ''} exported to CSV`;
        break;
      default:
        message = 'Bulk action completed';
    }

    addNotification(message, 'success');
    setBulkActionModal({ isOpen: false, actionType: null });
    setSelectedAssets([]);
  };

  const handleExport = () => {
    // Simulate CSV export
    const csvContent = filteredAssets?.map((asset) =>
    `${asset?.assetId},${asset?.name},${asset?.category},${asset?.status},${asset?.location},${asset?.lastUpdated}`
    )?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assets_export_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();

    addNotification('Asset list exported successfully', 'success');
  };

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = () => {
    addNotification('You have 3 new notifications', 'info');
  };

  const handleProfileClick = (action) => {
    switch (action) {
      case 'logout':navigate('/');
        break;
      default:
        addNotification(`${action} clicked`, 'info');
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notif) => notif?.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={currentUser} />

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header
          user={currentUser}
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick} />

        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Asset List</h1>
              <p className="text-muted-foreground">
                Manage and track all your IT assets with advanced filtering and bulk operations
              </p>
            </div>

            {/* Filter Toolbar */}
            <FilterToolbar
              onFilterChange={handleFilterChange}
              onBulkAction={handleBulkAction}
              selectedCount={selectedAssets?.length}
              totalCount={filteredAssets?.length}
              onExport={handleExport} />


            {/* Asset Table */}
            {isLoading ?
            <div className="bg-card border border-border rounded-lg p-6">
                <TableSkeleton rows={8} columns={8} />
              </div> :

            <AssetTable
              assets={filteredAssets}
              selectedAssets={selectedAssets}
              onSelectionChange={handleSelectionChange}
              onQuickView={handleQuickView}
              onEdit={handleEdit}
              onPrintQR={handlePrintQR}
              sortConfig={sortConfig}
              onSort={handleSort} />

            }

            {/* Empty State */}
            {!isLoading && filteredAssets?.length === 0 &&
            <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Package" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No assets found</h3>
                <p className="text-muted-foreground mb-6">
                  No assets match your current filters. Try adjusting your search criteria or add new assets.
                </p>
                <Button
                variant="default"
                iconName="Plus"
                onClick={() => navigate('/asset-registration')}>

                  Add New Asset
                </Button>
              </div>
            }
          </div>
        </main>
      </div>
      {/* Modals */}
      <QuickViewPanel
        asset={quickViewAsset}
        isOpen={!!quickViewAsset}
        onClose={() => setQuickViewAsset(null)}
        onEdit={handleEdit}
        onPrintQR={handlePrintQR} />

      <QRCodeModal
        asset={qrCodeAsset}
        isOpen={!!qrCodeAsset}
        onClose={() => setQRCodeAsset(null)}
        onPrint={(asset) => {
          addNotification(`QR code printed for ${asset?.assetId}`, 'success');
          setQRCodeAsset(null);
        }} />

      <BulkActionModal
        isOpen={bulkActionModal?.isOpen}
        actionType={bulkActionModal?.actionType}
        selectedAssets={selectedAssets}
        onClose={() => setBulkActionModal({ isOpen: false, actionType: null })}
        onConfirm={handleBulkActionConfirm} />

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default AssetListPage;