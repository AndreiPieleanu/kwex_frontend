# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 80

CMD [ "npm", "start" ]