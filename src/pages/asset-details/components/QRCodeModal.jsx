import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeModal = ({ asset, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download the QR code
    console.log('Download QR code for asset:', asset?.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Asset QR Code</h3>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* QR Code Display */}
        <div className="text-center mb-6">
          {/* Mock QR Code - In real implementation, use a QR code library */}
          <div className="w-48 h-48 mx-auto bg-white border-2 border-border rounded-lg flex items-center justify-center mb-4">
            <div className="w-40 h-40 bg-foreground rounded grid grid-cols-8 gap-1 p-2">
              {Array.from({ length: 64 })?.map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${
                    Math.random() > 0.5 ? 'bg-white' : 'bg-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Asset Information */}
          <div className="space-y-2 text-sm">
            <div className="font-medium text-foreground">{asset?.name}</div>
            <div className="text-muted-foreground">Asset ID: {asset?.id}</div>
            <div className="text-muted-foreground">Serial: {asset?.serialNumber}</div>
            <div className="text-muted-foreground font-mono text-xs">
              panasonic-isd.com/asset/{asset?.id}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2" />
            QR Code Instructions
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Scan to quickly access asset details</li>
            <li>• Print and attach to physical asset</li>
            <li>• Use for inventory tracking and audits</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            iconName="Printer"
            iconPosition="left"
            onClick={handlePrint}
            className="flex-1"
          >
            Print
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            onClick={handleDownload}
            className="flex-1"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;