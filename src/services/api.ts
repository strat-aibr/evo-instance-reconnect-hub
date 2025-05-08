
/**
 * API service for Evolution API
 * This service connects to our secure proxy endpoints
 */

/**
 * Check the connection state of an instance
 */
export interface ConnectionStateResponse {
  instance: {
    instanceName: string;
    state: 'open' | 'close' | 'connecting';
  };
}

export async function checkConnectionState(instance: string): Promise<ConnectionStateResponse> {
  if (!instance || instance.trim() === '') {
    throw new Error("Parâmetro de instância não informado ou inválido");
  }
  
  // Sanitize the instance parameter to prevent injection
  const sanitizedInstance = encodeURIComponent(instance.trim());
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`/api/connectionState?instance=${sanitizedInstance}`, {
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Instância não encontrada");
      } else if (response.status === 401 || response.status === 403) {
        throw new Error("Acesso não autorizado à API");
      } else {
        throw new Error(`Erro ao verificar estado da conexão: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data || !data.instance) {
      throw new Error("Resposta inválida da API");
    }
    
    return data;
  } catch (error) {
    console.error("Error checking connection state:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Tempo limite excedido ao verificar estado da conexão");
    }
    throw error;
  }
}

/**
 * Connect an instance and get QR code
 */
export interface ConnectInstanceResponse {
  pairingCode?: string;
  code?: string;
  qr?: string; // Primary field from API
  base64?: string; // Fallback field
  count?: number;
}

export async function connectInstance(instance: string): Promise<ConnectInstanceResponse> {
  if (!instance || instance.trim() === '') {
    throw new Error("Parâmetro de instância não informado ou inválido");
  }
  
  // Sanitize the instance parameter to prevent injection
  const sanitizedInstance = encodeURIComponent(instance.trim());
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    const response = await fetch(`/api/connect?instance=${sanitizedInstance}`, {
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Instância não encontrada");
      } else if (response.status === 401 || response.status === 403) {
        throw new Error("Acesso não autorizado à API");
      } else {
        throw new Error(`Erro ao conectar instância: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data || (!data.qr && !data.base64)) {
      throw new Error("QR code não recebido do servidor");
    }
    
    return data;
  } catch (error) {
    console.error("Error connecting instance:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Tempo limite excedido ao conectar instância");
    }
    throw error;
  }
}
