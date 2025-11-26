import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QRCodeModal = ({ asset, isOpen, onClose, onPrint }) => {
  if (!isOpen || !asset) return null;

  // Generate QR code URL (using a QR code service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `Asset ID: ${asset?.assetId}\nName: ${asset?.name}\nSerial: ${asset?.serialNumber}\nLocation: ${asset?.location}`
  )}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document?.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${asset?.assetId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #000;
              padding: 20px;
              margin: 20px;
              max-width: 300px;
            }
            .asset-info {
              margin-top: 15px;
              font-size: 12px;
              line-height: 1.4;
            }
            .asset-id {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 5px;
            }
            img {
              max-width: 200px;
              height: auto;
            }
            @media print {
              body { margin: 0; }
              .qr-container { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code for asset ${asset?.assetId}" />
            <div class="asset-info">
              <div class="asset-id">${asset?.assetId}</div>
              <div>${asset?.name}</div>
              <div>S/N: ${asset?.serialNumber}</div>
              <div>${asset?.location}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow?.document?.close();
    printWindow?.print();
    
    if (onPrint) {
      onPrint(asset);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-300"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-400 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">QR Code</h2>
              <p className="text-sm text-muted-foreground">{asset?.assetId}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center">
              {/* QR Code */}
              <div className="inline-block p-4 bg-white border-2 border-border rounded-lg mb-4">
                <img
                  src={qrCodeUrl}
                  alt={`QR code containing asset information for ${asset?.name} with ID ${asset?.assetId}`}
                  className="w-48 h-48 mx-auto"
                />
              </div>

              {/* Asset Information */}
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-foreground">{asset?.name}</div>
                <div className="font-mono text-primary">{asset?.assetId}</div>
                <div className="text-muted-foreground">S/N: {asset?.serialNumber}</div>
                <div className="text-muted-foreground">{asset?.location}</div>
              </div>

              {/* QR Code Info */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Info" size={14} />
                  <span>Scan to view asset details</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Printer"
              onClick={handlePrint}
              className="flex-1"
            >
              Print QR Code
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRCodeModal;