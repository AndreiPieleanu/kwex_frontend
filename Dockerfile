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

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the build output to Nginx's default directory
COPY --from=builder /app/build /usr/share/nginx/html

# Set ownership of the Nginx folders to the non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/run

# Switch to the non-root user
USER appuser

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start container
CMD ["nginx", "-g", "daemon off;"]