FROM node:18.20

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

COPY package*.json ./
RUN rm -rf node_modules
RUN rm -rf uploads/**
RUN npm install

