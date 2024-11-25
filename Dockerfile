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
# Expose port 3000
EXPOSE 3000

# Start container
CMD ["nginx", "-g", "daemon off;"]