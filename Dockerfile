# Use a specific, stable Node.js image
FROM node:18.19-alpine3.19

# Set working directory
WORKDIR /app

# Ensure Node modules are installed in production context
ENV NODE_ENV=production

# Copy only package files first for better cache usage
COPY package*.json ./

# Install only production dependencies (ci garante lockfile exato)
RUN npm ci --omit=dev

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port used by Next.js server
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
