
# WhatsApp Instance Reconnection App

Secure application for reconnecting WhatsApp instances through the Evolution API.

## Setup

1. Create a `.env.local` file based on `.env.local.example`:
```
cp .env.local.example .env.local
```

2. Edit the `.env.local` file and add your Evolution API URL and key:
```
EVOLUTION_API_URL=https://yourevolutionapi.example.com
EVOLUTION_API_KEY=your_api_key_here
```

## Development

```
npm run dev
```

## Production Deployment with Easypanel

### Using Docker

1. Make sure Docker is installed on your Easypanel server.

2. Deploy using the Dockerfile in this repository.

3. Set environment variables in Easypanel:
   - `EVOLUTION_API_URL`: Your Evolution API URL
   - `EVOLUTION_API_KEY`: Your Evolution API key

4. Ensure HTTPS is enabled for production security.

### Troubleshooting Docker Rate Limits

If you encounter Docker pull rate limit errors during deployment:

1. Consider authenticating with Docker Hub in Easypanel settings
2. Reduce the number of container builds/deployments in a short period
3. Use specific image tags to minimize pull requests
4. Wait a few hours and try again if rate limits have been exceeded

### Manual Deployment

1. Clone this repository to your server.

2. Install dependencies:
```
npm install
```

3. Build the Next.js app:
```
npm run build
```

4. Create a `.env.local` file with your configuration.

5. Start the server:
```
npm start
```

6. For production, use a process manager like PM2:
```
npm install -g pm2
pm2 start npm --name "whatsapp-reconnect" -- start
```

## Security Features

- API key stored in environment variables, not in frontend code
- Backend proxy to prevent direct access to Evolution API
- Input validation to prevent injection attacks
- Security headers to enhance application security
- HTTPS recommended for all production deployments
