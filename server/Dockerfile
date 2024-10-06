FROM node:18.20

WORKDIR /app

COPY . .

COPY package*.json ./
RUN rm -rf node_modules
RUN npm install

