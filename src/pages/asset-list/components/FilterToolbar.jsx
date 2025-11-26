import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';


const FilterToolbar = ({ 
  onFilterChange, 
  onBulkAction, 
  selectedCount = 0, 
  totalCount = 0,
  onExport 
}) => {
  const [filters, setFilters] = useState({
    category: '',
    status: [],
    location: '',
    dateRange: { start: '', end: '' }
  });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'laptop', label: 'Laptops' },
    { value: 'desktop', label: 'Desktops' },
    { value: 'monitor', label: 'Monitors' },
    { value: 'printer', label: 'Printers' },
    { value: 'mobile', label: 'Mobile Devices' },
    { value: 'tablet', label: 'Tablets' },
    { value: 'server', label: 'Servers' },
    { value: 'network', label: 'Network Equipment' }
  ];

  const statusOptions = [
    { value: 'in_use', label: 'In Use' },
    { value: 'in_storage', label: 'In Storage' },
    { value: 'under_repair', label: 'Under Repair' },
    { value: 'retired', label: 'Retired' },
    { value: 'lost', label: 'Lost/Stolen' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'hq_floor_1', label: 'HQ - Floor 1' },
    { value: 'hq_floor_2', label: 'HQ - Floor 2' },
    { value: 'hq_floor_3', label: 'HQ - Floor 3' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'branch_tokyo', label: 'Tokyo Branch' },
    { value: 'branch_osaka', label: 'Osaka Branch' },
    { value: 'remote', label: 'Remote/Home Office' }
  ];

  const bulkActionOptions = [
    { value: 'update_status', label: 'Update Status' },
    { value: 'transfer_location', label: 'Transfer Location' },
    { value: 'assign_user', label: 'Assign to User' },
    { value: 'generate_qr', label: 'Generate QR Codes' },
    { value: 'export_selected', label: 'Export Selected' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...filters?.dateRange, [field]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: '',
      status: [],
      location: '',
      dateRange: { start: '', end: '' }
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters?.category || filters?.status?.length > 0 || filters?.location || filters?.dateRange?.start || filters?.dateRange?.end;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Select category"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          multiple
          searchable
          placeholder="Select status"
        />

        <Select
          label="Location"
          options={locationOptions}
          value={filters?.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Select location"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={filters?.dateRange?.start}
              onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
            />
            <Input
              type="date"
              placeholder="End date"
              value={filters?.dateRange?.end}
              onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
            />
          </div>
        </div>
      </div>
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Showing {totalCount} assets
            {hasActiveFilters && (
              <span className="ml-2 text-accent">
                (filtered)
              </span>
            )}
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={clearAllFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {selectedCount > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              
              <Select
                options={bulkActionOptions}
                value=""
                onChange={(value) => onBulkAction(value)}
                placeholder="Bulk Actions"
                className="w-40"
              />
            </>
          )}

          <Button
            variant="outline"
            iconName="Download"
            onClick={onExport}
          >
            Export CSV
          </Button>

          <Button
            variant="default"
            iconName="Plus"
            onClick={() => window.location.href = '/asset-registration'}
          >
            Add Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;