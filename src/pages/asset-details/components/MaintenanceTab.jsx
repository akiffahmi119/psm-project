import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MaintenanceTab = ({ maintenanceHistory }) => {
  const [showAddForm, setShowAddForm] = useState(false);

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

  const getMaintenanceTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'preventive':
        return 'bg-success/10 text-success border-success/20';
      case 'corrective':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'emergency':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-accent/10 text-accent border-accent/20';
    }
  };

  const totalMaintenanceCost = maintenanceHistory?.reduce((sum, record) => sum + record?.cost, 0);

  return (
    <div tabId="maintenance">
      {/* Header with Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Maintenance History</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Total Records: {maintenanceHistory?.length}</span>
            <span>Total Cost: {formatCurrency(totalMaintenanceCost)}</span>
          </div>
        </div>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0"
        >
          Add Maintenance Record
        </Button>
      </div>
      {/* Maintenance Timeline */}
      <div className="space-y-4">
        {maintenanceHistory?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Wrench" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Maintenance Records</h4>
            <p className="text-muted-foreground mb-4">
              This asset has no maintenance history recorded yet.
            </p>
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowAddForm(true)}
            >
              Add First Record
            </Button>
          </div>
        ) : (
          maintenanceHistory?.map((record, index) => (
            <div key={record?.id} className="relative">
              {/* Timeline Line */}
              {index !== maintenanceHistory?.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />
              )}
              
              {/* Maintenance Record Card */}
              <div className="flex space-x-4">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-card border-2 border-primary rounded-full flex items-center justify-center">
                  <Icon 
                    name={record?.type === 'Emergency' ? 'AlertTriangle' : 'Wrench'} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                
                {/* Record Content */}
                <div className="flex-1 bg-card border border-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{record?.title}</h4>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{formatDate(record?.date)}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getMaintenanceTypeColor(record?.type)}`}>
                          {record?.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <div className="text-lg font-semibold text-foreground">
                        {formatCurrency(record?.cost)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        by {record?.technician}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {record?.description}
                  </p>
                  
                  {record?.partsReplaced && record?.partsReplaced?.length > 0 && (
                    <div className="border-t border-border pt-3">
                      <h5 className="text-sm font-medium text-foreground mb-2">Parts Replaced:</h5>
                      <div className="flex flex-wrap gap-2">
                        {record?.partsReplaced?.map((part, partIndex) => (
                          <span 
                            key={partIndex}
                            className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {record?.nextMaintenanceDate && (
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex items-center text-sm">
                        <Icon name="Calendar" size={16} className="mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Next maintenance due: </span>
                        <span className="font-medium text-foreground ml-1">
                          {formatDate(record?.nextMaintenanceDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Add Maintenance Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add Maintenance Record</h3>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowAddForm(false)}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              This feature would integrate with the maintenance logging system to add new records.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => setShowAddForm(false)}
              >
                Add Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTab;