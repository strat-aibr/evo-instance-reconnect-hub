
import React, { useEffect, useState } from 'react';
import ReconnectionFlow from '@/components/ReconnectionFlow';
import StatusMessage from '@/components/StatusMessage';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [instance, setInstance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get the instance parameter from URL
    const params = new URLSearchParams(window.location.search);
    const instanceParam = params.get('instance');
    setInstance(instanceParam);
    setIsLoading(false);
  }, []);

  // Show loading state while checking URL parameters
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <StatusMessage type="loading" message="Carregando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Reconectar Whatsapp</h1>
        
        {!instance ? (
          <Card>
            <CardContent className="p-6">
              <StatusMessage 
                type="error" 
                message="Instância não informada. Adicione o parâmetro '?instance=NOME_DA_INSTANCIA' na URL." 
              />
            </CardContent>
          </Card>
        ) : (
          <ReconnectionFlow instance={instance} />
        )}
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Reconexão Whatsapp 
        </footer>
      </div>
    </div>
  );
};

export default Index;
