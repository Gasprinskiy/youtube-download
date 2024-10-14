#!/bin/bash

cd ./nginx
rm -rf dist

cd ../client
rm -rf dist
rm -rf node_modules

npm i
npm run build

