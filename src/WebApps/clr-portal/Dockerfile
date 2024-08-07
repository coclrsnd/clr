# Use Node.js 18.13 as the base image for the build stage
FROM node:18.13 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory into the working directory
COPY . .

# Build the Angular app
RUN npm run build --prod

# Serve the Angular app using Nginx
FROM nginx:alpine

# Copy custom nginx.conf to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app from the build stage to the NGINX web root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]
