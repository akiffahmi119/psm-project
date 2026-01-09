import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AssetTable = ({ 
  assets = [], 
  selectedAssets = [], 
  onSelectionChange, 
  onQuickView, 
  onEdit, 
  onPrintQR,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'checked_out':
        return 'bg-success/10 text-success border-success/20';
      case 'in_storage':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in_repair':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'broken':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'retired':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'checked_out':
        return 'Checked Out';
      case 'in_storage':
        return 'In Storage';
      case 'in_repair':
        return 'In Repair';
      case 'broken':
        return 'Broken';
      case 'retired':
        return 'Retired';
      default:
        return status;
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(assets?.map(asset => asset?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectAsset = (assetId, checked) => {
    if (checked) {
      onSelectionChange([...selectedAssets, assetId]);
    } else {
      onSelectionChange(selectedAssets?.filter(id => id !== assetId));
    }
  };

  const handleSort = (column) => {
    const direction = sortConfig?.column === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isAllSelected = assets?.length > 0 && selectedAssets?.length === assets?.length;
  const isIndeterminate = selectedAssets?.length > 0 && selectedAssets?.length < assets?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('assetId')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Asset ID</span>
                  <Icon name={getSortIcon('assetId')} size={14} />
                </button>
              </th>
              
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Asset Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Location</span>
                  <Icon name={getSortIcon('location')} size={14} />
                </button>
              </th>
              
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Last Updated</span>
                  <Icon name={getSortIcon('lastUpdated')} size={14} />
                </button>
              </th>
              
              <th className="text-right p-4 w-32">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {assets?.map((asset) => (
              <tr
                key={asset?.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                  selectedAssets?.includes(asset?.id) ? 'bg-accent/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(asset?.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onQuickView(asset)}
              >
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <Checkbox
                    checked={selectedAssets?.includes(asset?.id)}
                    onChange={(e) => handleSelectAsset(asset?.id, e?.target?.checked)}
                  />
                </td>
                
                <td className="p-4">
                  <span className="font-mono text-sm text-primary font-medium">
                    {asset?.assetId}
                  </span>
                </td>
                
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{asset?.product_name}</div>
                    <div className="text-sm text-muted-foreground">{asset?.model}</div>
                  </div>
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-foreground capitalize">
                    {asset?.category?.replace('_', ' ')}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(asset?.status)}`}>
                    {getStatusLabel(asset?.status)}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-foreground">{asset?.location}</span>
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(asset?.lastUpdated)}
                  </span>
                </td>
                
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Eye"
                      onClick={() => onQuickView(asset)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Edit"
                      onClick={() => onEdit(asset)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="QrCode"
                      onClick={() => onPrintQR(asset)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 p-4">
        {assets?.map((asset) => (
          <div
            key={asset?.id}
            className={`border border-border rounded-lg p-4 transition-colors ${
              selectedAssets?.includes(asset?.id) ? 'bg-accent/5 border-accent/20' : 'hover:bg-muted/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedAssets?.includes(asset?.id)}
                  onChange={(e) => handleSelectAsset(asset?.id, e?.target?.checked)}
                />
                <div>
                  <div className="font-mono text-sm text-primary font-medium">
                    {asset?.assetId}
                  </div>
                  <div className="font-medium text-foreground">{asset?.product_name}</div>
                </div>
              </div>
              
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(asset?.status)}`}>
                {getStatusLabel(asset?.status)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="text-foreground capitalize">{asset?.category?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">{asset?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span className="text-foreground">{formatDate(asset?.lastUpdated)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                onClick={() => onQuickView(asset)}
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                onClick={() => onEdit(asset)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="QrCode"
                onClick={() => onPrintQR(asset)}
              >
                QR
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetTable;