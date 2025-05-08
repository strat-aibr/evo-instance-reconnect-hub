
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Build the frontend
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
