# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install app dependencies 
COPY package*.json ./
RUN npm install --silent
# add app
COPY . .
RUN npm run build
# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the build output to Nginx's default directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start container
CMD ["nginx", "-g", "daemon off;"]