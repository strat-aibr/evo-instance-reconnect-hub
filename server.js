
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Security headers middleware
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy routes
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://api.example.com';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

// Validate the instance parameter to prevent injection
const validateInstance = (instance) => {
  if (!instance || typeof instance !== 'string' || instance.trim() === '') {
    return false;
  }
  // Only allow alphanumeric characters, dashes and underscores
  return /^[a-zA-Z0-9_-]+$/.test(instance);
};

// Connection state endpoint
app.get('/api/connectionState', async (req, res) => {
  const instance = req.query.instance;

  if (!validateInstance(instance)) {
    return res.status(400).json({ error: 'Invalid instance parameter' });
  }

  if (!EVOLUTION_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const apiResponse = await axios({
      method: 'GET',
      url: `${EVOLUTION_API_URL}/instance/connectionState/${instance}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      timeout: 15000 // 15 second timeout
    });

    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error checking connection state:', error);
    
    // Handle specific error responses
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'Instância não encontrada' });
      } else if (error.response.status === 401 || error.response.status === 403) {
        return res.status(403).json({ error: 'Acesso não autorizado à API' });
      }
      return res.status(error.response.status).json({ 
        error: `Erro ao verificar estado da conexão: ${error.response.status}` 
      });
    }
    
    // Handle timeout and network errors
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Tempo limite excedido ao verificar estado da conexão' });
    }
    
    res.status(500).json({ error: 'Erro interno ao verificar conexão' });
  }
});

// Connect instance endpoint
app.get('/api/connect', async (req, res) => {
  const instance = req.query.instance;

  if (!validateInstance(instance)) {
    return res.status(400).json({ error: 'Invalid instance parameter' });
  }

  if (!EVOLUTION_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const apiResponse = await axios({
      method: 'GET',
      url: `${EVOLUTION_API_URL}/instance/connect/${instance}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      timeout: 20000 // 20 second timeout
    });

    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error connecting instance:', error);
    
    // Handle specific error responses
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'Instância não encontrada' });
      } else if (error.response.status === 401 || error.response.status === 403) {
        return res.status(403).json({ error: 'Acesso não autorizado à API' });
      }
      return res.status(error.response.status).json({ 
        error: `Erro ao conectar instância: ${error.response.status}` 
      });
    }
    
    // Handle timeout and network errors
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Tempo limite excedido ao conectar instância' });
    }
    
    res.status(500).json({ error: 'Erro interno ao conectar instância' });
  }
});

// Serve the SPA for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
