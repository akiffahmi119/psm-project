import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LocationSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  departmentOptions, 
  locationOptions,
  departmentSuggestions,
  onDepartmentSearch 
}) => {
  const handleInputChange = (field, value) => {
    onInputChange(field, value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="MapPin" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Location Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Department"
          type="text"
          placeholder="Enter department name"
          required
          value={formData?.department}
          onChange={(e) => {
            handleInputChange('department', e?.target?.value);
            onDepartmentSearch(e?.target?.value);
          }}
          error={errors?.department}
          description="Department responsible for this asset"
        />

        <Select
          label="Location"
          description="Physical location of the asset"
          required
          options={locationOptions}
          value={formData?.location}
          onChange={(value) => handleInputChange('location', value)}
          error={errors?.location}
          placeholder="Select location..."
        />

        <Input
          label="Building"
          type="text"
          placeholder="Enter building name/number"
          value={formData?.building}
          onChange={(e) => handleInputChange('building', e?.target?.value)}
          error={errors?.building}
          description="Building where asset is located"
        />

        <Input
          label="Floor"
          type="text"
          placeholder="Enter floor number"
          value={formData?.floor}
          onChange={(e) => handleInputChange('floor', e?.target?.value)}
          error={errors?.floor}
          description="Floor level (e.g., 1st Floor, Ground)"
        />

        <Input
          label="Room/Area"
          type="text"
          placeholder="Enter room number or area"
          value={formData?.room}
          onChange={(e) => handleInputChange('room', e?.target?.value)}
          error={errors?.room}
          description="Specific room or area location"
        />

        <Input
          label="Assigned To"
          type="text"
          placeholder="Enter employee name (optional)"
          value={formData?.assignedTo}
          onChange={(e) => handleInputChange('assignedTo', e?.target?.value)}
          error={errors?.assignedTo}
          description="Employee currently using this asset"
        />
      </div>
      {/* Department Suggestions */}
      {departmentSuggestions?.length > 0 && formData?.department && (
        <div className="mt-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium text-foreground mb-2">Suggested Departments:</p>
            <div className="flex flex-wrap gap-2">
              {departmentSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleInputChange('department', suggestion)}
                  className="px-3 py-1 bg-background border border-border rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSection;