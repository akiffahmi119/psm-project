import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ selectedCategories, onCategoryChange, selectedDepartment, onDepartmentChange }) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'desktops', label: 'Desktop Computers' },
    { value: 'monitors', label: 'Monitors' },
    { value: 'servers', label: 'Servers' },
    { value: 'networking', label: 'Network Equipment' },
    { value: 'printers', label: 'Printers' },
    { value: 'mobile', label: 'Mobile Devices' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'it', label: 'IT Department' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'research', label: 'Research & Development' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <Select
              label="Asset Category"
              options={categoryOptions}
              value={selectedCategories}
              onChange={onCategoryChange}
              placeholder="Select category"
              className="w-full"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Select
              label="Department"
              options={departmentOptions}
              value={selectedDepartment}
              onChange={onDepartmentChange}
              placeholder="Select department"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;