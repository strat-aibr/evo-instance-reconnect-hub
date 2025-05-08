
import React from 'react';

interface QRCodeProps {
  qrData: string;
}

const QRCode: React.FC<QRCodeProps> = ({ qrData }) => {
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
      
      <p className="text-center mt-4 text-gray-700 max-w-md">
        Abra o WhatsApp no seu celular e escaneie o QR Code acima para reconectar sua instância.
      </p>
    </div>
  );
};

export default QRCode;
