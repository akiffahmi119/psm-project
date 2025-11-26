import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormActions = ({ 
  onSaveDraft, 
  onSaveAndAddAnother, 
  onSaveAndGenerateQR, 
  isLoading, 
  hasErrors,
  isDraftSaved 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Left Side - Draft Status */}
        <div className="flex items-center space-x-2">
          {isDraftSaved ? (
            <>
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">Draft saved automatically</span>
            </>
          ) : (
            <>
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Changes not saved</span>
            </>
          )}
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onSaveDraft}
            loading={isLoading === 'draft'}
            iconName="Save"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Save Draft
          </Button>

          <Button
            variant="secondary"
            onClick={onSaveAndAddAnother}
            loading={isLoading === 'addAnother'}
            disabled={hasErrors}
            iconName="Plus"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Save &amp; Add Another
          </Button>

          <Button
            variant="default"
            onClick={onSaveAndGenerateQR}
            loading={isLoading === 'generateQR'}
            disabled={hasErrors}
            iconName="QrCode"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Save &amp; Generate QR Code
          </Button>
        </div>
      </div>

      {/* Error Summary */}
      {hasErrors && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-error">Please fix the following errors:</p>
              <p className="text-sm text-error mt-1">
                Complete all required fields and resolve validation errors before saving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="HelpCircle" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Quick Actions:</p>
            <ul className="mt-1 space-y-1">
              <li>• <strong>Save Draft:</strong> Save progress without validation</li>
              <li>• <strong>Save &amp; Add Another:</strong> Complete registration and start a new asset</li>
              <li>• <strong>Save &amp; Generate QR:</strong> Complete registration and create printable QR code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormActions;