#!/bin/bash

cd ./nginx
rm -rf dist

cd ../client
rm -rf dist

npm i
npm run build

cp -r ./dist ../nginx/dist
cd ../

docker compose down --rmi all --volumes --remove-orphans
docker compose up --build