#!/bin/bash

# node -v
whoami

cd ./nginx
rm -rf dist

cd ../client
rm -rf dist
rm -rf node_modules

npm i
npm run build

cp -r ./dist ../nginx/dist
cd ../

docker compose down --rmi all --volumes --remove-orphans
docker compose up -d