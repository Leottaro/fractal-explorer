FROM node:23-alpine
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 9090

# Start the server
CMD ["npm", "run", "preview"]