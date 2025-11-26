import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAddAsset = () => {
    navigate('/asset-registration');
  };

  const handleBulkImport = () => {
    navigate('/asset-registration?mode=bulk');
  };

  const handleViewAssets = () => {
    navigate('/asset-list');
  };

  const handleLifecyclePlanning = () => {
    navigate('/lifecycle-planning');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={handleAddAsset}
          className="justify-start"
        >
          Add New Asset
        </Button>
        <Button
          variant="outline"
          iconName="Upload"
          iconPosition="left"
          onClick={handleBulkImport}
          className="justify-start"
        >
          Bulk Import
        </Button>
        <Button
          variant="ghost"
          iconName="Package"
          iconPosition="left"
          onClick={handleViewAssets}
          className="justify-start"
        >
          View All Assets
        </Button>
        <Button
          variant="ghost"
          iconName="TrendingUp"
          iconPosition="left"
          onClick={handleLifecyclePlanning}
          className="justify-start"
        >
          Lifecycle Planning
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;