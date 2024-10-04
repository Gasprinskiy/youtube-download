#!/bin/bash

cd ./client

npm i

npm run build

cp -r ./dist ../nginx/dist

cd ../

docker compose build
docker compose up --remove-orphans