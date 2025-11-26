import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AssetDetailsSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  categoryOptions, 
  modelSuggestions, 
  onModelSearch 
}) => {
  const handleInputChange = (field, value) => {
    onInputChange(field, value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Package" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Asset Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Asset Category"
          description="Select the type of asset being registered"
          required
          options={categoryOptions}
          value={formData?.category}
          onChange={(value) => handleInputChange('category', value)}
          error={errors?.category}
          placeholder="Choose category..."
        />

        <Input
          label="Asset Name"
          type="text"
          placeholder="Enter asset name"
          required
          value={formData?.assetName}
          onChange={(e) => handleInputChange('assetName', e?.target?.value)}
          error={errors?.assetName}
          description="Descriptive name for the asset"
        />

        <Input
          label="Model"
          type="text"
          placeholder="Enter model number or name"
          required
          value={formData?.model}
          onChange={(e) => {
            handleInputChange('model', e?.target?.value);
            onModelSearch(e?.target?.value);
          }}
          error={errors?.model}
          description="Model number or name with autocomplete"
        />

        <Input
          label="Serial Number"
          type="text"
          placeholder="Enter serial number"
          required
          value={formData?.serialNumber}
          onChange={(e) => handleInputChange('serialNumber', e?.target?.value)}
          error={errors?.serialNumber}
          description="Unique identifier for this asset"
        />

        <Input
          label="Manufacturer"
          type="text"
          placeholder="Enter manufacturer name"
          required
          value={formData?.manufacturer}
          onChange={(e) => handleInputChange('manufacturer', e?.target?.value)}
          error={errors?.manufacturer}
          description="Company that manufactured the asset"
        />

        <Input
          label="Asset Tag"
          type="text"
          placeholder="Enter asset tag (optional)"
          value={formData?.assetTag}
          onChange={(e) => handleInputChange('assetTag', e?.target?.value)}
          error={errors?.assetTag}
          description="Internal asset tag or barcode"
        />
      </div>
      {/* Model Suggestions */}
      {modelSuggestions?.length > 0 && formData?.model && (
        <div className="mt-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium text-foreground mb-2">Suggested Models:</p>
            <div className="flex flex-wrap gap-2">
              {modelSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleInputChange('model', suggestion)}
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

export default AssetDetailsSection;