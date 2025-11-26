import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AppIcon from '../../../components/AppIcon';

const BarcodeScanner = ({ onBarcodeScanned, onClose }) => {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Focus on manual input when modal opens
    const timer = setTimeout(() => {
      const input = document.getElementById('manual-barcode-input');
      if (input) {
        input?.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Start camera scanning
  const startScanning = async () => {
    try {
      setIsScanning(true);
      setScanError('');

      const stream = await navigator.mediaDevices?.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        }
      });

      streamRef.current = stream;
      
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        videoRef?.current?.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanError('Unable to access camera. Please check permissions and try again.');
      setIsScanning(false);
    }
  };

  // Stop camera scanning
  const stopScanning = () => {
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setScanError('');
  };

  // Handle manual barcode input
  const handleManualSubmit = (e) => {
    e?.preventDefault();
    if (manualInput?.trim()) {
      onBarcodeScanned?.(manualInput?.trim());
    }
  };

  // Simulate barcode detection (In a real implementation, you'd use a barcode library)
  const simulateBarcodeDetection = () => {
    const sampleBarcodes = ['AST-12345', 'AST-23456', 'LOAN-001', 'LOAN-002'];
    const randomBarcode = sampleBarcodes?.[Math.floor(Math.random() * sampleBarcodes?.length)];
    onBarcodeScanned?.(randomBarcode);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Scan Barcode</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Scan or enter asset/loan barcode
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Scanner Content */}
        <div className="p-6 space-y-6">
          {/* Camera Scanner */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium text-foreground mb-2">Camera Scanner</h3>
              
              {!isScanning ? (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <AppIcon name="Camera" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your camera to scan barcodes
                    </p>
                    <Button
                      variant="outline"
                      iconName="Camera"
                      iconPosition="left"
                      onClick={startScanning}
                    >
                      Start Scanning
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
                    <div className="absolute inset-4 border border-primary/30 rounded">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white text-sm bg-black/50 px-3 py-1 rounded inline-block">
                        Position barcode within the frame
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {scanError && (
                <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-sm text-error">{scanError}</p>
                </div>
              )}

              {isScanning && (
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Square"
                    iconPosition="left"
                    onClick={stopScanning}
                  >
                    Stop Scanning
                  </Button>
                  
                  {/* Demo button for testing */}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Zap"
                    iconPosition="left"
                    onClick={simulateBarcodeDetection}
                    className="text-warning hover:text-warning"
                  >
                    Demo Scan
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground text-center">Manual Entry</h3>
            
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                id="manual-barcode-input"
                type="text"
                label="Asset ID or Barcode"
                placeholder="Enter barcode manually..."
                value={manualInput}
                onChange={(e) => setManualInput(e?.target?.value)}
                required
              />
              
              <Button
                type="submit"
                fullWidth
                iconName="Search"
                iconPosition="left"
                disabled={!manualInput?.trim()}
              >
                Search Asset
              </Button>
            </form>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="flex items-center justify-center gap-2">
              <AppIcon name="Info" size={14} />
              Supported formats: Asset IDs, Serial Numbers, QR Codes
            </p>
            <p>Examples: AST-12345, LOAN-001, MBP-34567</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;