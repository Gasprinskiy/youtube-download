#!/bin/bash

cd ../client

cp -r ./dist ../nginx/dist
cd ../

docker compose down --rmi all --volumes --remove-orphans
docker compose up -d