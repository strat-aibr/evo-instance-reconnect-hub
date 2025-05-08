
/**
 * API service for Evolution API
 * Important: This should be used with a backend proxy in production
 * to avoid exposing API keys on the client side
 */

const API_URL = import.meta.env.VITE_API_URL || "https://evolution.metricaas.com.br";
const API_KEY = import.meta.env.VITE_API_KEY || "YmwZyRg27Hp1mWH7qd6xYlOnh4tfsRKC";

// For demonstration - in production, use a secure backend proxy
// to avoid exposing API keys on the client side
const headers = {
  "Content-Type": "application/json",
  "apikey": API_KEY
};

/**
 * Check the connection state of an instance
 */
export async function checkConnectionState(instance: string): Promise<{ state: string }> {
  if (!instance) {
    throw new Error("Instance parameter is required");
  }
  
  // Sanitize the instance parameter to prevent injection
  const sanitizedInstance = encodeURIComponent(instance.trim());
  
  try {
    const response = await fetch(`${API_URL}/instance/connectionState/${sanitizedInstance}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error checking connection state: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking connection state:", error);
    throw error;
  }
}

/**
 * Connect an instance and get QR code
 */
export interface ConnectInstanceResponse {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

export async function connectInstance(instance: string): Promise<ConnectInstanceResponse> {
  if (!instance) {
    throw new Error("Instance parameter is required");
  }
  
  // Sanitize the instance parameter to prevent injection
  const sanitizedInstance = encodeURIComponent(instance.trim());
  
  try {
    const response = await fetch(`${API_URL}/instance/connect/${sanitizedInstance}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error connecting instance: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error connecting instance:", error);
    throw error;
  }
}
