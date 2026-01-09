import React from 'react';
import Button from '../../../components/ui/Button';
import AppIcon from '../../../components/AppIcon';

const AssignmentTypeSelectionModal = ({ onClose, onAssignToEmployee, onAssignToDepartment }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Choose Assignment Type</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select whether to assign the asset to an employee or a department.
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start py-3 h-auto"
            onClick={onAssignToEmployee}
            iconName="User"
            iconPosition="left"
          >
            <span className="text-base font-medium">Assign to Employee</span>
            <span className="text-sm text-muted-foreground block -mt-1 ml-7">Assign the asset to a specific individual.</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start py-3 h-auto"
            onClick={onAssignToDepartment}
            iconName="Building"
            iconPosition="left"
          >
            <span className="text-base font-medium">Assign to Department</span>
            <span className="text-sm text-muted-foreground block -mt-1 ml-7">Assign the asset to an entire department.</span>
          </Button>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTypeSelectionModal;