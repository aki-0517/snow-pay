import { useState, useRef, useCallback } from "react";
import { IoQrCode, IoCamera, IoCopy, IoCheckmark, IoClose } from "react-icons/io5";

interface QRPaymentData {
  address: string;
  amount?: string;
  token?: string;
  memo?: string;
}

interface QRGeneratorProps {
  address?: string;
  onGenerate: (data: QRPaymentData) => void;
}

interface QRScannerProps {
  onScan: (data: QRPaymentData) => void;
  onClose: () => void;
}

// Mock QR code generation (in real implementation, you'd use a library like qrcode)
function generateQRCodeDataURL(data: string): string {
  // This is a placeholder - in real implementation, use qrcode library
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 200;
  
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', 100, 100);
    ctx.fillText(data.slice(0, 20) + '...', 100, 120);
  }
  
  return canvas.toDataURL();
}

function QRGenerator({ address, onGenerate }: QRGeneratorProps) {
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrData, setQrData] = useState<QRPaymentData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!address) return;

    const data: QRPaymentData = {
      address,
      amount: amount || undefined,
      token: "DMT",
      memo: memo || undefined,
    };

    const qrString = JSON.stringify(data);
    const qrCodeURL = generateQRCodeDataURL(qrString);
    
    setGeneratedQR(qrCodeURL);
    setQrData(data);
    onGenerate(data);
  };

  const handleCopyData = async () => {
    if (!qrData) return;
    
    try {
      const dataString = `Address: ${qrData.address}${qrData.amount ? `\nAmount: ${qrData.amount} ${qrData.token}` : ''}${qrData.memo ? `\nMemo: ${qrData.memo}` : ''}`;
      await navigator.clipboard.writeText(dataString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Generate Payment QR Code</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={address || ""}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
              placeholder="Connect wallet first"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (optional)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                step="0.01"
                min="0"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-500">DMT</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Memo (optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Payment description"
              maxLength={50}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!address}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <IoQrCode className="w-4 h-4" />
            <span>Generate QR Code</span>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {generatedQR ? (
            <>
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                <img src={generatedQR} alt="Payment QR Code" className="w-48 h-48" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Scan to send payment</p>
                <button
                  onClick={handleCopyData}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  {copied ? (
                    <IoCheckmark className="w-4 h-4" />
                  ) : (
                    <IoCopy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Details'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <IoQrCode className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">QR code will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock scanner implementation
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real implementation, you'd use a QR code reading library
    // For demo purposes, we'll simulate parsing
    const mockQRData: QRPaymentData = {
      address: "0x1234567890123456789012345678901234567890",
      amount: "25.5",
      token: "DMT",
      memo: "Payment for services"
    };

    setScanResult(JSON.stringify(mockQRData, null, 2));
    onScan(mockQRData);
  }, [onScan]);

  const handleStartCamera = () => {
    setIsScanning(true);
    // In a real implementation, you'd start camera access here
    setTimeout(() => {
      const mockQRData: QRPaymentData = {
        address: "0x9876543210987654321098765432109876543210",
        amount: "10.0",
        token: "DMT"
      };
      setScanResult(JSON.stringify(mockQRData, null, 2));
      onScan(mockQRData);
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Scan Payment QR Code</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={handleStartCamera}
              disabled={isScanning}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <IoCamera className="w-5 h-5" />
              <span>{isScanning ? 'Scanning...' : 'Use Camera'}</span>
            </button>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 text-gray-600 py-3 px-4 rounded-md hover:border-gray-400 hover:text-gray-700 flex items-center justify-center space-x-2"
              >
                <IoQrCode className="w-5 h-5" />
                <span>Upload QR Image</span>
              </button>
            </div>
          </div>

          {isScanning && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 text-sm">Scanning for QR code...</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {scanResult ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Scan Result:</h4>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">{scanResult}</pre>
            </div>
          ) : (
            <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <IoCamera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Scan result will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function QRPayment() {
  const [activeTab, setActiveTab] = useState<"generate" | "scan">("generate");
  const [currentAddress] = useState("0x1234567890123456789012345678901234567890"); // Mock address

  const handleGenerate = (data: QRPaymentData) => {
    console.log("Generated QR data:", data);
  };

  const handleScan = (data: QRPaymentData) => {
    console.log("Scanned QR data:", data);
    // In a real implementation, you'd populate the transfer form with this data
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "generate"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Generate QR
          </button>
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "scan"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Scan QR
          </button>
        </div>
      </div>

      {activeTab === "generate" ? (
        <QRGenerator address={currentAddress} onGenerate={handleGenerate} />
      ) : (
        <QRScanner onScan={handleScan} onClose={() => setActiveTab("generate")} />
      )}
    </div>
  );
}