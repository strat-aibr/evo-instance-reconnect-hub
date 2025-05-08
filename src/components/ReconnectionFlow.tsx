
import React, { useState, useEffect } from 'react';
import { checkConnectionState, connectInstance } from '@/services/api';
import StatusMessage from './StatusMessage';
import QRCode from './QRCode';
import { Card, CardContent } from '@/components/ui/card';

interface ReconnectionFlowProps {
  instance: string;
}

type ConnectionStatus = 'checking' | 'connected' | 'reconnecting' | 'error';

const ReconnectionFlow: React.FC<ReconnectionFlowProps> = ({ instance }) => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [qrCode, setQrCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const connectFlow = async () => {
      try {
        setStatus('checking');
        
        // Step 1: Check connection state
        const stateData = await checkConnectionState(instance);
        
        if (stateData.state === 'open') {
          setStatus('connected');
          return;
        }
        
        // Step 2: If not connected, try to connect
        setStatus('reconnecting');
        const connectionData = await connectInstance(instance);
        
        if (connectionData.qr) {
          setQrCode(connectionData.qr);
        } else {
          throw new Error("QR code not received from server");
        }
      } catch (error) {
        console.error("Connection flow error:", error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido na conexão");
      }
    };
    
    connectFlow();
  }, [instance]);
  
  const renderStatusMessage = () => {
    switch (status) {
      case 'checking':
        return <StatusMessage type="loading" message="Verificando status da instância..." />;
      case 'connected':
        return <StatusMessage type="success" message="Instância conectada com sucesso." />;
      case 'reconnecting':
        return <StatusMessage type="loading" message="Reconectando... gerando QR Code" />;
      case 'error':
        return <StatusMessage 
                 type="error" 
                 message={errorMessage || "Erro ao conectar. Verifique se o parâmetro da instância está correto."} 
               />;
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Reconexão de Instância</h2>
          <p className="text-gray-600">Instância: {instance}</p>
        </div>
        
        {renderStatusMessage()}
        
        {status === 'reconnecting' && qrCode && (
          <div className="mt-6">
            <QRCode qrData={qrCode} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReconnectionFlow;
