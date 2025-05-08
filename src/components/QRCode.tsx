
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface QRCodeProps {
  qrData: string;
  onRefresh: () => void;
}

const QRCode: React.FC<QRCodeProps> = ({ qrData, onRefresh }) => {
  // Safety check to ensure qrData is actually valid base64
  const isValidBase64 = () => {
    try {
      return qrData && qrData.trim().length > 0;
    } catch (e) {
      return false;
    }
  };

  if (!isValidBase64()) {
    return (
      <div className="bg-error-light text-error p-4 rounded-md">
        QR code data is invalid
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img 
          src={qrData.startsWith('data:') ? qrData : `data:image/png;base64,${qrData}`} 
          alt="WhatsApp QR Code" 
          className="w-64 h-64"
        />
      </div>
      
      <Button 
        onClick={onRefresh}
        className="mt-4 bg-green-500 hover:bg-green-600"
      >
        <RefreshCw className="mr-2" size={18} />
        Gerar novo QR Code
      </Button>
      
      <p className="text-center mt-4 text-gray-700 max-w-md">
        Abra o WhatsApp no seu celular e escaneie o QR Code acima para reconectar sua instância.
      </p>
    </div>
  );
};

export default QRCode;
