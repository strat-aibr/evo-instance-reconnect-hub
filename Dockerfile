
# Use a specific tag for stability and fewer pulls
FROM node:18.19-alpine3.19

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Build the frontend
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
