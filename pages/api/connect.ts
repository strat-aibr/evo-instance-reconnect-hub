import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { instance } = req.query;

  if (!instance || typeof instance !== 'string' || instance.trim() === '') {
    return res.status(400).json({ error: 'Invalid instance parameter' });
  }

  const sanitizedInstance = encodeURIComponent(instance.trim());
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!apiUrl || !apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing environment variables' });
  }

  try {
    const response = await axios.get(
      `${apiUrl}/instance/connect/${sanitizedInstance}`,
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: apiKey,
        },
        timeout: 20000,
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        error: error.response?.data?.error || error.message,
      });
    }

    return res.status(500).json({ error: 'Unknown server error' });
  }
}
