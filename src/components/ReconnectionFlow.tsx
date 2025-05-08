
import React, { useState, useEffect, useCallback } from 'react';
import { checkConnectionState, connectInstance, ConnectInstanceResponse } from '@/services/api';
import StatusMessage from './StatusMessage';
import QRCode from './QRCode';
import { Card, CardContent } from '@/components/ui/card';

interface ReconnectionFlowProps {
  instance: string;
}

type ConnectionStatus = 'checking' | 'connected' | 'reconnecting' | 'error';

const ReconnectionFlow: React.FC<ReconnectionFlowProps> = ({ instance }) => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const generateQrCode = useCallback(async () => {
    try {
      setStatus('reconnecting');
      const connectionData = await connectInstance(instance);
      
      if (connectionData.base64) {
        setQrCodeData(connectionData.base64);
      } else {
        throw new Error("QR code not received from server");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Erro ao gerar QR Code");
    }
  }, [instance]);
  
  const checkConnection = useCallback(async () => {
    try {
      setStatus('checking');
      
      // Step 1: Check connection state
      const stateData = await checkConnectionState(instance);
      
      if (stateData.state === 'open') {
        setStatus('connected');
        return true;
      }
      
      // Step 2: If not connected, generate QR code
      await generateQrCode();
      return false;
      
    } catch (error) {
      console.error("Connection flow error:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido na conexão");
      return false;
    }
  }, [instance, generateQrCode]);
  
  // Initial check on component mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);
  
  // Auto refresh QR code every 30 seconds if in reconnecting state
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (status === 'reconnecting') {
      intervalId = window.setInterval(() => {
        console.log('Auto refreshing QR code...');
        generateQrCode();
      }, 30000); // 30 seconds
    }
    
    // Clear interval on component unmount or status change
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [status, generateQrCode]);
  
  const handleRefreshClick = () => {
    generateQrCode();
  };
  
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
        
        {status === 'reconnecting' && qrCodeData && (
          <div className="mt-6">
            <QRCode qrData={qrCodeData} onRefresh={handleRefreshClick} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReconnectionFlow;
