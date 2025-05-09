
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { instance } = req.query;

  // Validate instance parameter
  if (!instance || typeof instance !== 'string' || instance.trim() === '') {
    return res.status(400).json({ error: 'Invalid instance parameter' });
  }

  const sanitizedInstance = encodeURIComponent(instance.trim());
  const evolutionApiUrl = process.env.EVOLUTION_API_URL;
  const evolutionApiKey = process.env.EVOLUTION_API_KEY;

  // Validate environment variables
  if (!evolutionApiUrl || !evolutionApiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: `${evolutionApiUrl}/instance/connectionState/${sanitizedInstance}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': evolutionApiKey
      },
      timeout: 15000 // 15 second timeout
    });

    // Forward the response from Evolution API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error checking connection state:', error);
    
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Error checking connection state';
      
      return res.status(statusCode).json({ 
        error: errorMessage
      });
    }

    return res.status(500).json({ error: 'Unknown server error' });
  }
}
