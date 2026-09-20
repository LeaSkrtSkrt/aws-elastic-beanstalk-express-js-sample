# Node.js 16 runtime required for the application
FROM node:16

# Run the application from a dedicated working directory
WORKDIR /app

# Copy dependency manifests first for efficient Docker layer caching
COPY package*.json ./

# Install exact dependencies from package-lock.json
RUN npm ci --omit=dev

# Copy the application source
COPY . .

# Application listens on port 8080
EXPOSE 8080

# Start the Express application
CMD ["npm", "start"]
