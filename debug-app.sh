#!/bin/bash

echo "🔍 Debugging MP3 Metadata Editor..."

# Copy debug-main.ts to src directory
cp debug-main.ts src/main.ts

# Set development environment
export NODE_ENV=development
export ELECTRON_ARCH=arm64
export ELECTRON_PLATFORM=darwin

# Run in development mode
npm run dev 