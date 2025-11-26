import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import AssetDetailsSection from './components/AssetDetailsSection';
import LocationSection from './components/LocationSection';
import FinancialSection from './components/FinancialSection';
import FileUploadSection from './components/FileUploadSection';
import ProgressIndicator from './components/ProgressIndicator';
import FormActions from './components/FormActions';

const AssetRegistration = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@panasonic.com",
    role: "it_staff",
    avatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
    avatarAlt: "Professional headshot of woman with brown hair in business attire smiling at camera"
  };

  // Form steps configuration
  const formSteps = [
  {
    id: 'details',
    title: 'Asset Details',
    description: 'Basic Info',
    longDescription: 'Enter basic asset information including category, model, and serial number.'
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Assignment',
    longDescription: 'Specify where the asset is located and who it is assigned to.'
  },
  {
    id: 'financial',
    title: 'Financial',
    description: 'Cost & Warranty',
    longDescription: 'Add purchase information, costs, and warranty details.'
  },
  {
    id: 'attachments',
    title: 'Attachments',
    description: 'Documents',
    longDescription: 'Upload supporting documents like receipts and warranties.'
  }];


  const [currentStep, setCurrentStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    // Asset Details
    category: '',
    assetName: '',
    model: '',
    serialNumber: '',
    manufacturer: '',
    assetTag: '',

    // Location Information
    department: '',
    location: '',
    building: '',
    floor: '',
    room: '',
    assignedTo: '',

    // Financial Information
    purchaseDate: '',
    purchaseCost: '',
    supplier: '',
    poNumber: '',
    warrantyPeriod: '',
    warrantyExpiry: '',
    depreciationMethod: '',
    expectedLife: '',

    // Files
    attachments: []
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Suggestions and options
  const [modelSuggestions, setModelSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);

  // Mock data for dropdowns
  const categoryOptions = [
  { value: 'laptop', label: 'Laptop Computer' },
  { value: 'desktop', label: 'Desktop Computer' },
  { value: 'monitor', label: 'Monitor/Display' },
  { value: 'printer', label: 'Printer' },
  { value: 'server', label: 'Server Equipment' },
  { value: 'network', label: 'Network Equipment' },
  { value: 'mobile', label: 'Mobile Device' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'projector', label: 'Projector' },
  { value: 'camera', label: 'Camera Equipment' },
  { value: 'audio', label: 'Audio Equipment' },
  { value: 'storage', label: 'Storage Device' },
  { value: 'other', label: 'Other Equipment' }];


  const locationOptions = [
  { value: 'hq-tokyo', label: 'Headquarters - Tokyo' },
  { value: 'hq-osaka', label: 'Headquarters - Osaka' },
  { value: 'branch-nagoya', label: 'Branch Office - Nagoya' },
  { value: 'branch-fukuoka', label: 'Branch Office - Fukuoka' },
  { value: 'warehouse-tokyo', label: 'Warehouse - Tokyo' },
  { value: 'warehouse-osaka', label: 'Warehouse - Osaka' },
  { value: 'rd-center', label: 'R&D Center' },
  { value: 'manufacturing', label: 'Manufacturing Facility' },
  { value: 'remote', label: 'Remote/Home Office' }];


  const supplierOptions = [
  { value: 'dell', label: 'Dell Technologies' },
  { value: 'hp', label: 'HP Inc.' },
  { value: 'lenovo', label: 'Lenovo Group' },
  { value: 'apple', label: 'Apple Inc.' },
  { value: 'microsoft', label: 'Microsoft Corporation' },
  { value: 'cisco', label: 'Cisco Systems' },
  { value: 'canon', label: 'Canon Inc.' },
  { value: 'epson', label: 'Epson Corporation' },
  { value: 'samsung', label: 'Samsung Electronics' },
  { value: 'lg', label: 'LG Electronics' },
  { value: 'panasonic', label: 'Panasonic Corporation' },
  { value: 'sony', label: 'Sony Corporation' }];


  const warrantyOptions = [
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
  { value: '3years', label: '3 Years' },
  { value: '4years', label: '4 Years' },
  { value: '5years', label: '5 Years' },
  { value: 'lifetime', label: 'Lifetime Warranty' },
  { value: 'none', label: 'No Warranty' }];


  // Mock suggestions data
  const mockModelSuggestions = {
    'dell': ['Dell Latitude 7420', 'Dell OptiPlex 7090', 'Dell Precision 5560'],
    'hp': ['HP EliteBook 840', 'HP ProDesk 600', 'HP LaserJet Pro'],
    'lenovo': ['ThinkPad X1 Carbon', 'ThinkCentre M90n', 'IdeaPad 5'],
    'apple': ['MacBook Pro 16"', 'MacBook Air M2', 'iMac 24"'],
    'canon': ['Canon imageRUNNER', 'Canon PIXMA Pro', 'Canon EOS R5']
  };

  const mockDepartmentSuggestions = [
  'Information Systems Department',
  'Human Resources',
  'Finance & Accounting',
  'Research & Development',
  'Manufacturing Operations',
  'Quality Assurance',
  'Marketing & Sales',
  'Legal & Compliance',
  'Facilities Management',
  'Executive Office'];


  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }

    // Auto-save draft
    setIsDraftSaved(false);
    debouncedSaveDraft();
  };

  // Handle model search for suggestions
  const handleModelSearch = (query) => {
    if (!query || query?.length < 2) {
      setModelSuggestions([]);
      return;
    }

    const suggestions = [];
    Object.entries(mockModelSuggestions)?.forEach(([brand, models]) => {
      models?.forEach((model) => {
        if (model?.toLowerCase()?.includes(query?.toLowerCase())) {
          suggestions?.push(model);
        }
      });
    });

    setModelSuggestions(suggestions?.slice(0, 5));
  };

  // Handle department search for suggestions
  const handleDepartmentSearch = (query) => {
    if (!query || query?.length < 2) {
      setDepartmentSuggestions([]);
      return;
    }

    const filtered = mockDepartmentSuggestions?.filter((dept) =>
    dept?.toLowerCase()?.includes(query?.toLowerCase())
    );
    setDepartmentSuggestions(filtered?.slice(0, 5));
  };

  // Debounced auto-save function
  const debouncedSaveDraft = (() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsDraftSaved(true);
      }, 2000);
    };
  })();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Asset Details validation
    if (!formData?.category) newErrors.category = 'Asset category is required';
    if (!formData?.assetName) newErrors.assetName = 'Asset name is required';
    if (!formData?.model) newErrors.model = 'Model is required';
    if (!formData?.serialNumber) newErrors.serialNumber = 'Serial number is required';
    if (!formData?.manufacturer) newErrors.manufacturer = 'Manufacturer is required';

    // Location validation
    if (!formData?.department) newErrors.department = 'Department is required';
    if (!formData?.location) newErrors.location = 'Location is required';

    // Financial validation
    if (!formData?.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData?.purchaseCost) newErrors.purchaseCost = 'Purchase cost is required';
    if (!formData?.supplier) newErrors.supplier = 'Supplier is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((n) => n?.id !== id));
  };

  // Handle form actions
  const handleSaveDraft = async () => {
    setIsLoading('draft');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(null);
    setIsDraftSaved(true);
    addNotification('Draft saved successfully', 'success');
  };

  const handleSaveAndAddAnother = async () => {
    if (!validateForm()) {
      addNotification('Please fix validation errors before saving', 'error');
      return;
    }

    setIsLoading('addAnother');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(null);
    addNotification('Asset registered successfully! Ready for next asset.', 'success');

    // Reset form for new asset
    setFormData({
      category: '',
      assetName: '',
      model: '',
      serialNumber: '',
      manufacturer: '',
      assetTag: '',
      department: '',
      location: '',
      building: '',
      floor: '',
      room: '',
      assignedTo: '',
      purchaseDate: '',
      purchaseCost: '',
      supplier: '',
      poNumber: '',
      warrantyPeriod: '',
      warrantyExpiry: '',
      depreciationMethod: '',
      expectedLife: '',
      attachments: []
    });
    setCurrentStep(1);
    setErrors({});
  };

  const handleSaveAndGenerateQR = async () => {
    if (!validateForm()) {
      addNotification('Please fix validation errors before saving', 'error');
      return;
    }

    setIsLoading('generateQR');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(null);
    addNotification('Asset registered successfully! QR code generated.', 'success');

    // Navigate to asset details with QR code modal
    navigate('/asset-details', {
      state: {
        showQRModal: true,
        assetData: formData
      }
    });
  };

  // Handle header actions
  const handleSearch = (query) => {
    navigate('/search-results', { state: { query } });
  };

  const handleNotificationClick = () => {
    addNotification('You have 3 pending asset approvals', 'info');
  };

  const handleProfileClick = (action) => {
    if (action === 'logout') {
      navigate('/');
    }
  };

  // Check if form has errors
  const hasErrors = Object.keys(errors)?.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user} />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header
          user={user}
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick} />

        
        <main className="pt-16 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Asset Registration</h1>
                <p className="text-muted-foreground mt-1">
                  Register a new asset with comprehensive details and documentation
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={formSteps?.length}
              steps={formSteps} />


            {/* Form Sections */}
            <div className="space-y-6">
              {/* Asset Details Section */}
              <AssetDetailsSection
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                categoryOptions={categoryOptions}
                modelSuggestions={modelSuggestions}
                onModelSearch={handleModelSearch} />


              {/* Location Section */}
              <LocationSection
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                departmentOptions={[]}
                locationOptions={locationOptions}
                departmentSuggestions={departmentSuggestions}
                onDepartmentSearch={handleDepartmentSearch} />


              {/* Financial Section */}
              <FinancialSection
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
                supplierOptions={supplierOptions}
                warrantyOptions={warrantyOptions} />


              {/* File Upload Section */}
              <FileUploadSection
                files={formData?.attachments}
                onFilesChange={(files) => handleInputChange('attachments', files)}
                maxFiles={5} />


              {/* Form Actions */}
              <FormActions
                onSaveDraft={handleSaveDraft}
                onSaveAndAddAnother={handleSaveAndAddAnother}
                onSaveAndGenerateQR={handleSaveAndGenerateQR}
                isLoading={isLoading}
                hasErrors={hasErrors}
                isDraftSaved={isDraftSaved} />

            </div>
          </div>
        </main>
      </div>
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default AssetRegistration;