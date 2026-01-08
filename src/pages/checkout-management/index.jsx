import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabaseClient';
import ActiveLoansPanel from './components/ActiveLoansPanel';
import AssignmentTypeSelectionModal from './components/AssignmentTypeSelectionModal';
import AssetSelectionModal from './components/AssetSelectionModal';
import BarcodeScanner from './components/BarcodeScanner';
import CheckInModal from './components/CheckInModal';
import CheckoutPanel from './components/CheckoutPanel';
import DepartmentSearchModal from './components/DepartmentSearchModal';
import EmployeeSearchModal from './components/EmployeeSearchModal';
import FilterToolbar from './components/FilterToolbar';
import StatsCards from './components/StatsCards';

const CheckoutManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('active-loans');
  const [showAssetSelection, setShowAssetSelection] = useState(false);
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showAssignmentTypeSelection, setShowAssignmentTypeSelection] = useState(false);
  const [showDepartmentSearch, setShowDepartmentSearch] = useState(false); // New state for department search modal
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // New state for selected department
  const [checkInAsset, setCheckInAsset] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [inStorageAssets, setInStorageAssets] = useState([]);
  const [filters, setFilters] = useState({
    employee: '',
    department: '',
    category: '',
    status: 'all',
    overdue: false
  });

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const addNotification = (message, type) => {
    setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
  };

  const fetchActiveLoans = async () => {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        id,
        checkout_date,
        expected_return_date,
        status,
        notes,
        assets (id, product_name, category),
        employees (id, full_name, departments (name)),
        departments (id, name)
      `)
      .in('status', ['checked_out', 'overdue']);

    if (error) {
      console.error('Error fetching active loans:', error);
      addNotification(`Error fetching loans: ${error.message}`, 'error');
      return [];
    }

    return data.map(loan => ({
      id: loan.id,
      assetId: loan.assets.id,
      assetName: loan.assets.product_name,
      assetCategory: loan.assets.category,
      assignedTo: loan.employees ? {
        type: 'employee',
        id: loan.employees.id,
        name: loan.employees.full_name,
        department: loan.employees.departments?.name,
      } : loan.departments ? {
        type: 'department',
        id: loan.departments.id,
        name: loan.departments.name,
      } : null,
      checkoutDate: new Date(loan.checkout_date),
      expectedReturnDate: new Date(loan.expected_return_date),
      status: loan.status,
      notes: loan.notes,
    }));
  };

  const fetchInStorageAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*, suppliers(company_name)')
        .eq('status', 'in_storage');
      if (error) {
        console.error('Error fetching in-storage assets:', error);
        addNotification(`Error fetching assets: ${error.message}`, 'error');
        return [];
      }
      console.log('Fetched in-storage assets:', data);
      return data;
    } catch (err) {
      console.error('Unexpected error fetching assets:', err);
      addNotification(`An unexpected error occurred while fetching assets.`, 'error');
      return [];
    }
  };

  const statsData = [
    {
      title: "Active Loans",
      value: activeLoans.length,
      subtitle: "Currently checked out",
      icon: "Package",
      color: "primary"
    },
    {
      title: "In Storage",
      value: inStorageAssets.length,
      subtitle: "Ready for checkout",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Overdue Returns",
      value: activeLoans.filter(loan => new Date(loan.expectedReturnDate) < new Date()).length,
      subtitle: "Past due date",
      icon: "AlertTriangle",
      color: "error"
    },
    {
      title: "Due This Week",
      value: activeLoans.filter(loan => {
        const dueDate = new Date(loan.expectedReturnDate);
        const today = new Date();
        const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        return dueDate > today && dueDate <= nextWeek;
      }).length,
      subtitle: "Returns expected",
      icon: "Calendar",
      color: "warning"
    }
  ];



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [loans, assets] = await Promise.all([
        fetchActiveLoans(),
        fetchInStorageAssets(),
      ]);
      console.log('Processed loans:', loans);
      console.log('Processed assets:', assets);
      setActiveLoans(loans);
      setInStorageAssets(assets);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
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
    setShowAssignmentTypeSelection(true); // Open the new modal for type selection
  };

  const handleEmployeeSelected = async (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeSearch(false);

    if (!selectedAsset || !employee) return;

    // Process checkout
    const newLoan = {
      asset_id: selectedAsset.id,
      employee_id: employee.id,
      checkout_date: new Date().toISOString(),
      expected_return_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };
    console.log('New loan object for employee:', newLoan);

    const { error: loanError } = await supabase.from('loans').insert([newLoan]);

    if (loanError) {
      setNotifications((prev) => [...prev, { id: Date.now(), message: `Error checking out asset: ${loanError.message}`, type: "error" }]);
    } else {
      const { error: assetError } = await supabase.from('assets').update({ status: 'checked_out' }).eq('id', selectedAsset.id);

      if (assetError) {
        setNotifications((prev) => [...prev, { id: Date.now(), message: `Error updating asset status: ${assetError.message}`, type: "error" }]);
      } else {
        setNotifications((prev) => [...prev, { id: Date.now(), message: `Asset ${selectedAsset.product_name} checked out to ${employee.name}`, type: "success" }]);
        // Refresh data
        const [loans, assets] = await Promise.all([fetchActiveLoans(), fetchInStorageAssets()]);
        setActiveLoans(loans);
        setInStorageAssets(assets);
      }
    }

    // Reset selections
    setSelectedAsset(null);
    setSelectedEmployee(null);
  };

  const handleDepartmentSelected = async (department) => {
    setSelectedDepartment(department);
    setShowDepartmentSearch(false);

    if (!selectedAsset || !department) return;

    // Process checkout to department
    const newLoan = {
      asset_id: selectedAsset.id,
      department_id: department.id, // Use department_id
      checkout_date: new Date().toISOString(),
      expected_return_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };
    console.log('New loan object for department:', newLoan);

    const { error: loanError } = await supabase.from('loans').insert([newLoan]);

    if (loanError) {
      setNotifications((prev) => [...prev, { id: Date.now(), message: `Error checking out asset to department: ${loanError.message}`, type: "error" }]);
    } else {
      const { error: assetError } = await supabase.from('assets').update({ status: 'checked_out' }).eq('id', selectedAsset.id);

      if (assetError) {
        setNotifications((prev) => [...prev, { id: Date.now(), message: `Error updating asset status: ${assetError.message}`, type: "error" }]);
      } else {
        setNotifications((prev) => [...prev, { id: Date.now(), message: `Asset ${selectedAsset.product_name} checked out to ${department.name}`, type: "success" }]);
        // Refresh data
        const [loans, assets] = await Promise.all([fetchActiveLoans(), fetchInStorageAssets()]);
        setActiveLoans(loans);
        setInStorageAssets(assets);
      }
    }

    // Reset selections
    setSelectedAsset(null);
    setSelectedDepartment(null);
  };

  const handleCheckIn = (loan) => {
    setCheckInAsset(loan);
    setShowCheckInModal(true);
  };

  const handleCheckInComplete = async (loanId, condition, notes) => {
    const { error: loanError } = await supabase
      .from('loans')
      .update({
        status: 'returned',
        actual_return_date: new Date().toISOString(),
        notes: notes,
      })
      .eq('id', loanId);

    if (loanError) {
      setNotifications((prev) => [...prev, { id: Date.now(), message: `Error checking in asset: ${loanError.message}`, type: "error" }]);
    } else {
      const loan = activeLoans.find((l) => l.id === loanId);
      const { error: assetError } = await supabase.from('assets').update({ status: 'in_storage', condition: condition }).eq('id', loan.assetId);

      if (assetError) {
        setNotifications((prev) => [...prev, { id: Date.now(), message: `Error updating asset status: ${assetError.message}`, type: "error" }]);
      } else {
        setNotifications((prev) => [...prev, { id: Date.now(), message: `Asset successfully returned`, type: "success" }]);
        // Refresh data
        const [loans, assets] = await Promise.all([fetchActiveLoans(), fetchInStorageAssets()]);
        setActiveLoans(loans);
        setInStorageAssets(assets);
      }
    }

    setShowCheckInModal(false);
    setCheckInAsset(null);
  };

  const handleBarcodeScanned = async (barcode) => {
    setShowBarcodeScanner(false);

    // Try to find an asset with the barcode
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .eq('serial_number', barcode)
      .single();

    if (asset && asset.status === 'in_storage') {
      handleAssetSelected(asset);
      return;
    }

    if (asset && asset.status !== 'in_storage') {
        const loan = activeLoans.find((l) => l.assetId === asset.id);
        if(loan){
            handleCheckIn(loan);
            return;
        }
    }

    // If no asset found or asset not available, try to find a loan
    const { data: loan, error: loanError } = await supabase
      .from('loans')
      .select(`
        *,
        assets ( * ),
        employees ( *, departments ( * ) )
      `)
      .eq('id', barcode)
      .single();

    if (loan) {
        const formattedLoan = {
            id: loan.id,
            assetId: loan.assets.id,
            assetName: loan.assets.product_name,
            assetCategory: loan.assets.category,
            employee: {
              id: loan.employees.id,
              name: loan.employees.full_name,
              department: loan.employees.departments.name,
            },
            checkoutDate: new Date(loan.checkout_date),
            expectedReturnDate: new Date(loan.expected_return_date),
            status: loan.status,
            notes: loan.notes,
        }
      handleCheckIn(formattedLoan);
      return;
    }

    setNotifications((prev) => [...prev, { id: Date.now(), message: `No available asset or active loan found with barcode: ${barcode}`, type: "error" }]);
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
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
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
              onClick={() => setActiveTab('in-storage-assets')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'in-storage-assets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`
              }>

              <span className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/10 text-success text-xs font-bold">
                  {inStorageAssets?.length || 0}
                </span>
                In Storage
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
            assets={inStorageAssets}
            filters={filters}
            onAssetSelect={handleAssetSelected}
            onBulkOperation={handleBulkOperation} />

          }
        </div>
      </div>

      {/* Modals */}
      {showAssetSelection &&
      <AssetSelectionModal
        assets={inStorageAssets}
        onAssetSelect={handleAssetSelected}
        onClose={() => setShowAssetSelection(false)} />

      }

      {showAssignmentTypeSelection &&
        <AssignmentTypeSelectionModal
          onAssignToEmployee={() => {
            setShowAssignmentTypeSelection(false);
            setShowEmployeeSearch(true);
          }}
          onAssignToDepartment={() => {
            setShowAssignmentTypeSelection(false);
            setShowDepartmentSearch(true); // Open the Department search modal
          }}
          onClose={() => {
            setShowAssignmentTypeSelection(false);
            setSelectedAsset(null); // Clear selected asset if assignment is cancelled
          }}
        />
      }

      {showEmployeeSearch &&
      <EmployeeSearchModal
        onEmployeeSelect={handleEmployeeSelected}
        onClose={() => {
          setShowEmployeeSearch(false);
          setSelectedAsset(null);
        }} />

      }

      {showDepartmentSearch &&
      <DepartmentSearchModal
        onDepartmentSelect={handleDepartmentSelected}
        onClose={() => {
          setShowDepartmentSearch(false);
          setSelectedAsset(null); // Clear selected asset if assignment is cancelled
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

    </div>
  );
};

export default CheckoutManagement;