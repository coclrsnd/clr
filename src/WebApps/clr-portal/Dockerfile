# Stage 1: Build the Angular application
FROM node:14 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build -- --prod

# Stage 2: Serve the Angular application using nginx
FROM nginx:alpine

COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Copy the default nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
