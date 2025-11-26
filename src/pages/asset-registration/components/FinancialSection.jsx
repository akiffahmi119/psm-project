import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const FinancialSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  supplierOptions, 
  warrantyOptions 
}) => {
  const handleInputChange = (field, value) => {
    onInputChange(field, value);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value?.toString()?.replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    return number?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleCostChange = (e) => {
    const value = e?.target?.value;
    const numericValue = value?.replace(/[^0-9.]/g, '');
    handleInputChange('purchaseCost', numericValue);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="DollarSign" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Financial Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Purchase Date"
          type="date"
          required
          value={formData?.purchaseDate}
          onChange={(e) => handleInputChange('purchaseDate', e?.target?.value)}
          error={errors?.purchaseDate}
          description="Date when asset was purchased (MM/DD/YYYY)"
        />

        <div className="space-y-2">
          <Input
            label="Purchase Cost (USD)"
            type="text"
            placeholder="0.00"
            required
            value={formData?.purchaseCost ? `$${formatCurrency(formData?.purchaseCost)}` : ''}
            onChange={handleCostChange}
            error={errors?.purchaseCost}
            description="Total cost including taxes and fees"
          />
        </div>

        <Select
          label="Supplier/Vendor"
          description="Company that supplied this asset"
          required
          searchable
          options={supplierOptions}
          value={formData?.supplier}
          onChange={(value) => handleInputChange('supplier', value)}
          error={errors?.supplier}
          placeholder="Select or search supplier..."
        />

        <Input
          label="Purchase Order Number"
          type="text"
          placeholder="Enter PO number (optional)"
          value={formData?.poNumber}
          onChange={(e) => handleInputChange('poNumber', e?.target?.value)}
          error={errors?.poNumber}
          description="Reference purchase order number"
        />

        <Select
          label="Warranty Period"
          description="Duration of manufacturer warranty"
          options={warrantyOptions}
          value={formData?.warrantyPeriod}
          onChange={(value) => handleInputChange('warrantyPeriod', value)}
          error={errors?.warrantyPeriod}
          placeholder="Select warranty period..."
        />

        <Input
          label="Warranty Expiry Date"
          type="date"
          value={formData?.warrantyExpiry}
          onChange={(e) => handleInputChange('warrantyExpiry', e?.target?.value)}
          error={errors?.warrantyExpiry}
          description="When warranty coverage ends"
        />

        <Input
          label="Depreciation Method"
          type="text"
          placeholder="e.g., Straight Line, Declining Balance"
          value={formData?.depreciationMethod}
          onChange={(e) => handleInputChange('depreciationMethod', e?.target?.value)}
          error={errors?.depreciationMethod}
          description="Method used for asset depreciation"
        />

        <Input
          label="Expected Life (Years)"
          type="number"
          placeholder="Enter expected lifespan"
          min="1"
          max="50"
          value={formData?.expectedLife}
          onChange={(e) => handleInputChange('expectedLife', e?.target?.value)}
          error={errors?.expectedLife}
          description="Expected useful life in years"
        />
      </div>
    </div>
  );
};

export default FinancialSection;