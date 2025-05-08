
# WhatsApp Instance Reconnection App

Secure application for reconnecting WhatsApp instances through the Evolution API.

## Setup

1. Create a `.env` file based on `.env.example`:
```
cp .env.example .env
```

2. Edit the `.env` file and add your Evolution API URL and key:
```
EVOLUTION_API_URL=https://yourevolutionapi.example.com
EVOLUTION_API_KEY=your_api_key_here
PORT=3000
```

## Development

```
npm install
npm run dev
```

## Production Deployment with Easypanel

### Using Docker

1. Make sure Docker is installed on your Easypanel server.

2. Deploy using the Dockerfile in this repository.

3. Set environment variables in Easypanel:
   - `EVOLUTION_API_URL`: Your Evolution API URL
   - `EVOLUTION_API_KEY`: Your Evolution API key
   - `PORT`: 3000 (or your preferred port)

4. Add the following to your package.json if not already present:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

5. Ensure HTTPS is enabled for production security.

### Manual Deployment

1. Clone this repository to your server.

2. Install dependencies:
```
npm install
```

3. Build the frontend:
```
npm run build
```

4. Create a `.env` file with your configuration.

5. Start the server:
```
node server.js
```

6. For production, use a process manager like PM2:
```
npm install -g pm2
pm2 start server.js --name whatsapp-reconnect
```

## Security Features

- API key stored in environment variables, not in frontend code
- Backend proxy to prevent direct access to Evolution API
- Input validation to prevent injection attacks
- Security headers to enhance application security
- HTTPS recommended for all production deployments
