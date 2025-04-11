#!/bin/bash

echo "🚀 Building MP3 Metadata Editor for Apple Silicon (M1/M2)..."
echo "⏳ This process may take a few minutes..."

# Clean the output directory
rm -rf out/

# Ensure we have assets directory
mkdir -p assets

# Create an .icns file from the PNG if it doesn't exist or is empty
if [ ! -s assets/icon.icns ]; then
  echo "📦 Generating application icon from PNG..."
  
  # Use iconutil if available (macOS)
  mkdir -p assets/icon.iconset
  sips -z 16 16 assets/icon.png --out assets/icon.iconset/icon_16x16.png
  sips -z 32 32 assets/icon.png --out assets/icon.iconset/icon_16x16@2x.png
  sips -z 32 32 assets/icon.png --out assets/icon.iconset/icon_32x32.png
  sips -z 64 64 assets/icon.png --out assets/icon.iconset/icon_32x32@2x.png
  sips -z 128 128 assets/icon.png --out assets/icon.iconset/icon_128x128.png
  sips -z 256 256 assets/icon.png --out assets/icon.iconset/icon_128x128@2x.png
  sips -z 256 256 assets/icon.png --out assets/icon.iconset/icon_256x256.png
  sips -z 512 512 assets/icon.png --out assets/icon.iconset/icon_256x256@2x.png
  sips -z 512 512 assets/icon.png --out assets/icon.iconset/icon_512x512.png
  sips -z 1024 1024 assets/icon.png --out assets/icon.iconset/icon_512x512@2x.png
  iconutil -c icns assets/icon.iconset -o assets/icon.icns
  rm -rf assets/icon.iconset
fi

# Set environment variables for ARM64
export ELECTRON_ARCH=arm64
export ELECTRON_PLATFORM=darwin

# Run electron-forge directly (bypassing npm)
npx electron-forge package --arch=arm64 --platform=darwin

echo "✅ Build complete!"
echo "✅ Application package created in the 'out' directory"
echo ""
echo "To create a DMG, you can run:"
echo "npx electron-forge make --arch=arm64 --platform=darwin" 