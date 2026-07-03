# Use official Node.js LTS image
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# Expose application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]