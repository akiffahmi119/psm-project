import React from 'react';
import Icon from '../../../components/AppIcon';

const DetailsTab = ({ asset }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDepreciation = () => {
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    const yearsOwned = (currentDate - purchaseDate) / (1000 * 60 * 60 * 24 * 365);
    const annualDepreciation = asset?.purchasePrice * 0.2; // 20% per year
    const totalDepreciation = Math.min(annualDepreciation * yearsOwned, asset?.purchasePrice * 0.8);
    return asset?.purchasePrice - totalDepreciation;
  };

  const getWarrantyStatus = () => {
    const warrantyEnd = new Date(asset.warrantyExpiry);
    const today = new Date();
    const daysRemaining = Math.ceil((warrantyEnd - today) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining > 90) {
      return { status: 'Active', color: 'text-success', days: daysRemaining };
    } else if (daysRemaining > 0) {
      return { status: 'Expiring Soon', color: 'text-warning', days: daysRemaining };
    } else {
      return { status: 'Expired', color: 'text-error', days: Math.abs(daysRemaining) };
    }
  };

  const warrantyInfo = getWarrantyStatus();
  const currentValue = calculateDepreciation();

  return (
    <div tabId="details">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Package" size={20} className="mr-2" />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Asset Name</span>
                <span className="font-medium text-foreground">{asset?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">{asset?.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium text-foreground">{asset?.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium text-foreground">{asset?.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Serial Number</span>
                <span className="font-medium text-foreground font-mono">{asset?.serialNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Asset Tag</span>
                <span className="font-medium text-foreground font-mono">{asset?.assetTag}</span>
              </div>
            </div>
          </div>

          {/* Location & Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="MapPin" size={20} className="mr-2" />
              Location & Assignment
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Current Location</span>
                <span className="font-medium text-foreground">{asset?.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-foreground">{asset?.department?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Assigned To</span>
                <span className="font-medium text-foreground">{asset?.assignedTo || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Assignment Date</span>
                <span className="font-medium text-foreground">
                  {asset?.assignmentDate ? formatDate(asset?.assignmentDate) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="DollarSign" size={20} className="mr-2" />
              Financial Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Purchase Price</span>
                <span className="font-medium text-foreground">{formatCurrency(asset?.purchasePrice)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Current Value</span>
                <span className="font-medium text-foreground">{formatCurrency(currentValue)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-medium text-foreground">{formatDate(asset?.purchaseDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Supplier</span>
                <span className="font-medium text-foreground">{asset?.supplier?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Purchase Order</span>
                <span className="font-medium text-foreground font-mono">{asset?.purchaseOrder}</span>
              </div>
            </div>
          </div>

          {/* Warranty Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Shield" size={20} className="mr-2" />
              Warranty Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Warranty Status</span>
                <span className={`font-medium ${warrantyInfo?.color}`}>
                  {warrantyInfo?.status}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Warranty Expiry</span>
                <span className="font-medium text-foreground">{formatDate(asset?.warrantyExpiry)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Days Remaining</span>
                <span className={`font-medium ${warrantyInfo?.color}`}>
                  {warrantyInfo?.status === 'Expired' 
                    ? `Expired ${warrantyInfo?.days} days ago`
                    : `${warrantyInfo?.days} days`
                  }
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Warranty Provider</span>
                <span className="font-medium text-foreground">{asset?.warrantyProvider}</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Settings" size={20} className="mr-2" />
              Technical Specifications
            </h3>
            <div className="space-y-3">
              {asset?.specifications && Object.entries(asset?.specifications)?.map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground capitalize">{key?.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;