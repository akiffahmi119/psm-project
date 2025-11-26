import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import Button from '../../components/ui/Button';
import SupplierTable from './components/SupplierTable';
import SupplierDetailPanel from './components/SupplierDetailPanel';
import SupplierFormModal from './components/SupplierFormModal';
import FilterToolbar from './components/FilterToolbar';
import PerformanceMetrics from './components/PerformanceMetrics';

const SupplierManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    rating: 'all'
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

  // Mock suppliers data
  const mockSuppliers = [
  {
    id: 1,
    companyName: "TechFlow Solutions",
    contactPerson: "Michael Chen",
    email: "michael.chen@techflow.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    category: "Hardware",
    rating: 4.8,
    contractStart: "2024-01-15",
    contractEnd: "2025-01-15",
    totalOrders: 47,
    totalValue: "$285,420",
    lastInteraction: "2024-10-25",
    address: "123 Tech Street, Silicon Valley, CA 94105",
    website: "https://techflow.com",
    taxId: "12-3456789",
    paymentTerms: "Net 30",
    preferredVendor: true,
    notes: "Reliable supplier for computer hardware and peripherals. Excellent customer service.",
    image: "https://images.unsplash.com/photo-1698311427676-9495b8dc7244",
    imageAlt: "Modern office building with glass facade and corporate logo signage"
  },
  {
    id: 2,
    companyName: "GlobalTech Supply Co",
    contactPerson: "Sarah Rodriguez",
    email: "s.rodriguez@globaltech.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    category: "Software",
    rating: 4.5,
    contractStart: "2024-03-01",
    contractEnd: "2025-03-01",
    totalOrders: 23,
    totalValue: "$145,680",
    lastInteraction: "2024-10-22",
    address: "456 Innovation Drive, Austin, TX 73301",
    website: "https://globaltech-supply.com",
    taxId: "98-7654321",
    paymentTerms: "Net 15",
    preferredVendor: true,
    notes: "Software licensing and enterprise solutions provider.",
    image: "https://images.unsplash.com/photo-1655034723500-8427b4eb4ac8",
    imageAlt: "Modern skyscraper with reflective glass windows against blue sky"
  },
  {
    id: 3,
    companyName: "Network Pro Systems",
    contactPerson: "David Kim",
    email: "david.kim@networkpro.com",
    phone: "+1 (555) 456-7890",
    status: "pending",
    category: "Networking",
    rating: 4.2,
    contractStart: "2024-11-01",
    contractEnd: "2025-11-01",
    totalOrders: 12,
    totalValue: "$89,340",
    lastInteraction: "2024-10-20",
    address: "789 Network Lane, Denver, CO 80202",
    website: "https://networkpro.com",
    taxId: "45-6789012",
    paymentTerms: "Net 45",
    preferredVendor: false,
    notes: "Network infrastructure and security solutions.",
    image: "https://images.unsplash.com/photo-1663088522868-5c584f7ae6b0",
    imageAlt: "Corporate office building entrance with modern architecture and glass doors"
  },
  {
    id: 4,
    companyName: "Office Essentials Ltd",
    contactPerson: "Emily Watson",
    email: "e.watson@officeessentials.com",
    phone: "+1 (555) 234-5678",
    status: "inactive",
    category: "Office Supplies",
    rating: 3.8,
    contractStart: "2023-06-15",
    contractEnd: "2024-06-15",
    totalOrders: 156,
    totalValue: "$67,890",
    lastInteraction: "2024-09-15",
    address: "321 Business Blvd, Miami, FL 33101",
    website: "https://officeessentials.com",
    taxId: "78-9012345",
    paymentTerms: "Net 30",
    preferredVendor: false,
    notes: "Office supplies and furniture supplier. Contract expired.",
    image: "https://images.unsplash.com/photo-1710905281898-990953229065",
    imageAlt: "Modern office interior with desks, computers and professional workspace setup"
  },
  {
    id: 5,
    companyName: "Cloud Services Inc",
    contactPerson: "James Wilson",
    email: "james.wilson@cloudservices.com",
    phone: "+1 (555) 345-6789",
    status: "active",
    category: "Cloud Services",
    rating: 4.9,
    contractStart: "2024-02-10",
    contractEnd: "2025-02-10",
    totalOrders: 8,
    totalValue: "$198,750",
    lastInteraction: "2024-10-26",
    address: "654 Cloud Avenue, Seattle, WA 98101",
    website: "https://cloudservices.com",
    taxId: "56-7890123",
    paymentTerms: "Net 15",
    preferredVendor: true,
    notes: "Premium cloud infrastructure and hosting services.",
    image: "https://images.unsplash.com/photo-1543355584-e708a2e4d2f6",
    imageAlt: "Server room with rows of networking equipment and blue LED lighting"
  }];


  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter suppliers based on current filters
    let filtered = suppliers;

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter((supplier) =>
      supplier?.companyName?.toLowerCase()?.includes(searchLower) ||
      supplier?.contactPerson?.toLowerCase()?.includes(searchLower) ||
      supplier?.email?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter((supplier) => supplier?.status === filters?.status);
    }

    if (filters?.category !== 'all') {
      filtered = filtered?.filter((supplier) => supplier?.category === filters?.category);
    }

    if (filters?.rating !== 'all') {
      const ratingValue = parseFloat(filters?.rating);
      filtered = filtered?.filter((supplier) => supplier?.rating >= ratingValue);
    }

    setFilteredSuppliers(filtered);
  }, [suppliers, filters]);

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = () => {
    const newNotification = {
      id: Date.now(),
      message: "3 supplier contracts expiring within 30 days",
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

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setIsFormModalOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setIsFormModalOpen(true);
  };

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers((prev) => prev?.filter((supplier) => supplier?.id !== supplierId));
    if (selectedSupplier?.id === supplierId) {
      setSelectedSupplier(null);
    }

    const notification = {
      id: Date.now(),
      message: "Supplier deleted successfully",
      type: "success",
      duration: 3000
    };
    setNotifications((prev) => [...prev, notification]);
  };

  const handleSupplierSubmit = (supplierData) => {
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers((prev) =>
      prev?.map((supplier) =>
      supplier?.id === editingSupplier?.id ?
      { ...supplier, ...supplierData } :
      supplier
      )
      );

      const notification = {
        id: Date.now(),
        message: "Supplier updated successfully",
        type: "success",
        duration: 3000
      };
      setNotifications((prev) => [...prev, notification]);
    } else {
      // Add new supplier
      const newSupplier = {
        ...supplierData,
        id: Date.now(),
        totalOrders: 0,
        totalValue: "$0",
        lastInteraction: new Date()?.toISOString()?.split('T')?.[0]
      };

      setSuppliers((prev) => [...prev, newSupplier]);

      const notification = {
        id: Date.now(),
        message: "Supplier added successfully",
        type: "success",
        duration: 3000
      };
      setNotifications((prev) => [...prev, notification]);
    }

    setIsFormModalOpen(false);
    setEditingSupplier(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleBulkExport = () => {
    const notification = {
      id: Date.now(),
      message: "Supplier data exported successfully",
      type: "success",
      duration: 3000
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
              <h1 className="text-2xl font-bold text-foreground">Supplier Management</h1>
              <p className="text-muted-foreground">Manage vendor relationships and procurement workflows</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleBulkExport}>

                Export Data
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddSupplier}>

                Add Supplier
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics suppliers={suppliers} />

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            suppliersCount={filteredSuppliers?.length} />


          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Supplier Table */}
            <div className="xl:col-span-2">
              <SupplierTable
                suppliers={filteredSuppliers}
                selectedSupplier={selectedSupplier}
                onSupplierSelect={setSelectedSupplier}
                onSupplierEdit={handleEditSupplier}
                onSupplierDelete={handleDeleteSupplier} />

            </div>

            {/* Detail Panel */}
            <div className="xl:col-span-1">
              <SupplierDetailPanel
                supplier={selectedSupplier}
                onEdit={handleEditSupplier} />

            </div>
          </div>
        </div>
      </main>

      {/* Form Modal */}
      <SupplierFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingSupplier(null);
        }}
        supplier={editingSupplier}
        onSubmit={handleSupplierSubmit} />


      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default SupplierManagement;