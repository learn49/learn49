#!/usr/bin/env sh

npm install
# npm run build
npm run migration:run
npm run start:dev
