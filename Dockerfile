# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install --silent

# Copy the rest of the app's source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the build output to Nginx's default directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]