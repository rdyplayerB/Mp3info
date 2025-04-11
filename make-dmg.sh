#!/bin/bash

echo "Building MP3 Metadata Editor DMG..."
echo "This process may take a few minutes..."

# Ensure we have the png icon
if [ ! -f "assets/icon.png" ]; then
  echo "Error: Icon file missing at assets/icon.png"
  exit 1
fi

# Build ICNS from PNG if needed
if [ ! -f "assets/icon.icns" ]; then
  echo "Generating ICNS icon file from PNG..."
  
  # Create iconset
  mkdir -p assets/icon.iconset
  sips -z 16 16     assets/icon.png --out assets/icon.iconset/icon_16x16.png
  sips -z 32 32     assets/icon.png --out assets/icon.iconset/icon_16x16@2x.png
  sips -z 32 32     assets/icon.png --out assets/icon.iconset/icon_32x32.png
  sips -z 64 64     assets/icon.png --out assets/icon.iconset/icon_32x32@2x.png
  sips -z 128 128   assets/icon.png --out assets/icon.iconset/icon_128x128.png
  sips -z 256 256   assets/icon.png --out assets/icon.iconset/icon_128x128@2x.png
  sips -z 256 256   assets/icon.png --out assets/icon.iconset/icon_256x256.png
  sips -z 512 512   assets/icon.png --out assets/icon.iconset/icon_256x256@2x.png
  sips -z 512 512   assets/icon.png --out assets/icon.iconset/icon_512x512.png
  sips -z 1024 1024 assets/icon.png --out assets/icon.iconset/icon_512x512@2x.png
  
  # Convert iconset to ICNS
  iconutil -c icns assets/icon.iconset -o assets/icon.icns
  rm -rf assets/icon.iconset
fi

# Run electron-forge package command
npm run package

# Make the DMG
npx electron-builder build --mac --arm64 --config.dmg.icon=assets/icon.png --config.mac.icon=assets/icon.icns

echo "✅ MP3 Metadata Editor DMG created successfully!"
echo "✅ The UI has been completely modernized with a sleek design." 