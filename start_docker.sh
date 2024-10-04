#!/bin/bash

cd ./nginx
rm -rf dist

cd ../client
rm -rf dist

npm i
npm run build

cp -r ./dist ../nginx/dist
cd ../

docker compose up