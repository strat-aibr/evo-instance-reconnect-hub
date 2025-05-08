
import React, { useState, useEffect, useCallback } from 'react';
import { checkConnectionState, connectInstance, ConnectInstanceResponse } from '@/services/api';
import StatusMessage from './StatusMessage';
import QRCode from './QRCode';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

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
      if (status !== 'connected') {
        setStatus('checking');
      }
      
      // Step 1: Check connection state
      const stateData = await checkConnectionState(instance);
      
      // Check the state from the response
      if (stateData.instance && stateData.instance.state === 'open') {
        if (status !== 'connected') {
          setStatus('connected');
          toast.success("Instância conectada com sucesso!");
          return true;
        }
        setStatus('connected');
        return true;
      } else if (stateData.instance && (stateData.instance.state === 'close' || stateData.instance.state === 'connecting')) {
        // If state is close or connecting, immediately generate QR code
        await generateQrCode();
      } else {
        // Unknown state
        console.warn("Unknown connection state:", stateData);
        await generateQrCode();
      }
      return false;
      
    } catch (error) {
      console.error("Connection flow error:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido na conexão");
      return false;
    }
  }, [instance, generateQrCode, status]);
  
  // Initial check on component mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);
  
  // Poll connection status every 5 seconds
  useEffect(() => {
    const pollingId = setInterval(() => {
      console.log('Polling connection status...');
      checkConnection();
    }, 5000); // 5 seconds
    
    return () => clearInterval(pollingId);
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
        return <StatusMessage type="loading" message="Reconectando... escaneie o QR Code" />;
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
        </div>
        
        {renderStatusMessage()}
        
        {status === 'reconnecting' && qrCodeData && (
          <div className="mt-6">
            <QRCode qrData={qrCodeData} onRefresh={handleRefreshClick} />
          </div>
        )}

        {status === 'connected' && (
          <div className="mt-6 flex flex-col items-center">
            <div className="animate-pulse bg-green-100 text-green-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-center text-green-700 font-medium">
              WhatsApp conectado e pronto para uso!
            </p>
            <p className="text-center text-gray-500 text-sm mt-2">
              Você pode fechar esta janela com segurança.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReconnectionFlow;
