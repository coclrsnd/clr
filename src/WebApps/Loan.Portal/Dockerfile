# Use a base image with Node.js pre-installed
FROM node:14

# Install nvm (Node Version Manager)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Source nvm to make it available in the current shell
RUN . ~/.nvm/nvm.sh \
    && nvm install v18.13 \
    && nvm use v18.13

# Verify the installed Node.js version
RUN node --version

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build --prod

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the Angular application
CMD ["npm", "start"]
