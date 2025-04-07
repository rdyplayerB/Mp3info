#!/bin/bash

echo "🚀 Rebuilding MP3 Metadata Editor for Apple Silicon (M1/M2)..."
echo "⏳ This process may take a few minutes..."

# Clean the output directory
rm -rf out/

# Ensure we have assets directory
mkdir -p assets

# Copy debug-main.ts to src/main.ts (using the simplified version)
cp debug-main.ts src/main.ts

# Generate a proper icon file
echo "📦 Generating application icon..."

# Create a simple PNG icon since SVG may not be available
# Create a blue square with MP3 text
convert -size 1024x1024 xc:none -fill "#3B82F6" -draw "roundrectangle 0,0 1024,1024 120,120" \
  -gravity center -fill white -pointsize 200 -annotate 0 "MP3" \
  -pointsize 80 -annotate +0+150 "Metadata" \
  -pointsize 80 -annotate +0+250 "Editor" \
  assets/icon.png

# If convert fails (imagemagick not installed), create a fallback
if [ $? -ne 0 ]; then
  echo "⚠️ ImageMagick not found, using alternative icon method..."
  # Use sips to create a solid color image
  echo "<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'><rect width='1024' height='1024' rx='120' fill='#3B82F6'/><text x='512' y='512' font-family='Arial' font-size='200' fill='white' text-anchor='middle' dominant-baseline='middle'>MP3</text></svg>" > assets/temp.svg
  # Try to convert using any available tool
  if command -v svgexport &> /dev/null; then
    npx svgexport assets/temp.svg assets/icon.png 1024:1024
  elif command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w 1024 -h 1024 assets/temp.svg > assets/icon.png
  else
    # Fallback to a colored square
    mkdir -p assets/icon.iconset
    for size in 16 32 128 256 512 1024; do
      sips -g pixelWidth -g pixelHeight -g format \
        -s format png \
        --out assets/icon.iconset/icon_${size}x${size}.png \
        /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns
    done
  fi
fi

# Create macOS icon set
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
rm -rf assets/icon.iconset assets/temp.svg

# Set environment variables for ARM64
export ELECTRON_ARCH=arm64
export ELECTRON_PLATFORM=darwin

# Package the application
npx electron-forge package --arch=arm64 --platform=darwin

echo "✅ Build complete!"
echo "✅ Application package created in the 'out' directory"
echo ""
echo "To create a DMG, you can run:"
echo "npx electron-forge make --arch=arm64 --platform=darwin" 