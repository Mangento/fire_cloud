# Use Node.js 18 base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY functions/package*.json ./functions/

# Install dependencies
RUN npm install --only=production
RUN cd functions && npm install --only=production && cd ..

# Copy application files
COPY . .

# Expose port 8080
EXPOSE 8080

# Set environment variable
ENV PORT=8080

# Start the server
CMD ["node", "server.js"]
