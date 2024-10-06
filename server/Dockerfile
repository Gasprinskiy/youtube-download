FROM node:18.20

# WORKDIR /usr/code/rcs_new

# COPY . .
# RUN rm -rf node_modules
# RUN npm install

# RUN npm run build
# RUN rm -rf src && rm -rf yarn.lock && rm -rf package-lock.json && rm -rf nodemon.json && rm -rf tsconfig.json

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules
RUN npm install

COPY . .

# Собираем приложение
RUN npm run build