#!/bin/bash
export NODE_ENV=development
# Build renderer code
npx webpack --config webpack.config.js
# Build main/preload code
npx tsc -p tsconfig.electron.json
# Package the application
npm run package
npx electron . 