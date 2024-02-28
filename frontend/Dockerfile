# Use official Node.js image as base
FROM node:20 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Run TypeScript compilation
RUN npm run build


# Use Nginx image for serving the static files
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy build files from the previous stage
COPY --from=build /app/dist .

# Expose port 80
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
