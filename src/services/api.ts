
import axios from 'axios';

// Types for the API responses
export interface ConnectionStateResponse {
  instance?: {
    state: string;
    [key: string]: any;
  };
  error?: string;
}

export interface ConnectResponse {
  qr?: string;
  base64?: string;
  error?: string;
}

// Function to check the connection state of an instance
export const checkConnectionState = async (instance: string): Promise<ConnectionStateResponse> => {
  try {
    const response = await axios.get(`/api/connectionState?instance=${encodeURIComponent(instance)}`);
    return response.data;
  } catch (error) {
    console.error('Error checking connection state:', error);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return { error: 'Failed to check connection state' };
  }
};

// Function to connect to an instance
export const connectInstance = async (instance: string): Promise<ConnectResponse> => {
  try {
    const response = await axios.get(`/api/connect?instance=${encodeURIComponent(instance)}`);
    return response.data;
  } catch (error) {
    console.error('Error connecting to instance:', error);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw new Error('Failed to connect to instance');
  }
};
