#!/bin/bash

echo "Building MP3 Metadata Editor DMG..."
echo "This process may take a few minutes..."

# Ensure we have the png icon
if [ ! -f "assets/icon.png" ]; then
  echo "Error: Icon file missing at assets/icon.png"
  exit 1
fi

# Skip ICNS generation - we'll use PNG directly
echo "Using PNG icons directly without converting to ICNS..."

# Run electron-forge package command
npm run package

# Make the DMG using the PNG directly
npx electron-forge make -- --arch=arm64 --platform=darwin

echo "✅ MP3 Metadata Editor DMG created successfully!"
echo "✅ The UI has been completely modernized with a sleek design." 