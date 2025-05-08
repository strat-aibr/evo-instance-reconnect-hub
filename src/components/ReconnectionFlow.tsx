
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { checkConnectionState, connectInstance } from '@/services/api';
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
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const isChecking = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  
  const generateQrCode = useCallback(async () => {
    try {
      setStatus('reconnecting');
      const connectionData = await connectInstance(instance);
      
      // Update to use connectionData.qr instead of base64
      if (connectionData.qr) {
        setQrCodeData(connectionData.qr);
        setReconnectAttempts(prev => prev + 1);
      } else if (connectionData.base64) {
        // Fallback to base64 if qr is not available
        setQrCodeData(connectionData.base64);
        setReconnectAttempts(prev => prev + 1);
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
    // Prevent concurrent checking
    if (isChecking.current) {
      console.log('Already checking connection, skipping this call');
      return;
    }
    
    try {
      isChecking.current = true;
      
      if (status !== 'connected') {
        setStatus('checking');
      }
      
      // Validate instance parameter
      if (!instance || instance.trim() === '') {
        setStatus('error');
        setErrorMessage("Instância não informada ou inválida");
        isChecking.current = false;
        return false;
      }
      
      // Step 1: Check connection state
      const stateData = await checkConnectionState(instance);
      
      // Check the state from the response
      if (stateData.instance && stateData.instance.state === 'open') {
        if (status !== 'connected') {
          setStatus('connected');
          toast.success("Instância conectada com sucesso!");
        } else {
          setStatus('connected');
        }
        isChecking.current = false;
        return true;
      } else if (stateData.instance && 
                (stateData.instance.state === 'close' || 
                 stateData.instance.state === 'connecting')) {
        
        // Generate QR code if it's not already present or force update every 30 seconds
        if (!qrCodeData || reconnectAttempts % 6 === 0) { // Update QR every ~30 seconds (6 * 5s polling)
          await generateQrCode();
        }
      } else {
        // Unknown state
        console.warn("Unknown connection state:", stateData);
        
        // If we don't have a QR code yet, try to generate one
        if (!qrCodeData) {
          await generateQrCode();
        }
      }
      
      isChecking.current = false;
      return false;
      
    } catch (error) {
      console.error("Connection flow error:", error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? `Erro na conexão: ${error.message}` 
          : "Erro desconhecido na conexão. Verifique a instância ou tente novamente."
      );
      isChecking.current = false;
      return false;
    }
  }, [instance, generateQrCode, status, qrCodeData, reconnectAttempts]);
  
  // Setup polling with setTimeout
  const setupPolling = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Continue polling regardless of attempts count
    if (status !== 'error') {
      timeoutRef.current = window.setTimeout(async () => {
        console.log('Checking connection status...');
        await checkConnection();
        // Set up next polling only after current check completes
        setupPolling();
      }, 5000); // 5 seconds
    }
  }, [checkConnection, status]);
  
  // Initial check on component mount
  useEffect(() => {
    // Validate instance parameter right away
    if (!instance || instance.trim() === '') {
      setStatus('error');
      setErrorMessage("Instância não informada ou inválida");
      return;
    }
    
    checkConnection();
    setupPolling();
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [checkConnection, setupPolling, instance]);
  
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
        return <StatusMessage type="loading" message={`Reconectando (tentativa ${reconnectAttempts})... escaneie o QR Code`} />;
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
        
        {status !== 'connected' && qrCodeData && (
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
