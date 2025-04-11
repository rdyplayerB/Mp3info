#!/bin/bash

echo "🏗️ Building MP3 Metadata Editor for Apple Silicon (M1/M2)..."

# Clean previous builds
rm -rf out/ dist/

# Create assets directory if it doesn't exist
mkdir -p assets

# --- Icon Generation --- 
ICON_PNG="assets/icon.png"
ICON_ICNS="assets/icon.icns"
ICON_SET="assets/icon.iconset"
GENERIC_ICON="/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns"

# Check if PNG icon exists
if [ ! -f "$ICON_PNG" ]; then
  echo "❌ Error: PNG icon not found at $ICON_PNG"
  exit 1
fi

echo "📦 Generating ICNS icon from PNG..."

# Function to copy generic icon as fallback
copy_generic_icon() {
    echo "ℹ️ Using generic system icon as fallback."
    cp "$GENERIC_ICON" "$ICON_ICNS"
}

# Create ICNS from PNG
echo "🖼️ Generating iconset from PNG..."
mkdir -p "$ICON_SET"
sips -z 16 16     "$ICON_PNG" --out "${ICON_SET}/icon_16x16.png"
sips -z 32 32     "$ICON_PNG" --out "${ICON_SET}/icon_16x16@2x.png"
sips -z 32 32     "$ICON_PNG" --out "${ICON_SET}/icon_32x32.png"
sips -z 64 64     "$ICON_PNG" --out "${ICON_SET}/icon_32x32@2x.png"
sips -z 128 128   "$ICON_PNG" --out "${ICON_SET}/icon_128x128.png"
sips -z 256 256   "$ICON_PNG" --out "${ICON_SET}/icon_128x128@2x.png"
sips -z 256 256   "$ICON_PNG" --out "${ICON_SET}/icon_256x256.png"
sips -z 512 512   "$ICON_PNG" --out "${ICON_SET}/icon_256x256@2x.png"
sips -z 512 512   "$ICON_PNG" --out "${ICON_SET}/icon_512x512.png"
sips -z 1024 1024 "$ICON_PNG" --out "${ICON_SET}/icon_512x512@2x.png"

# Convert iconset to ICNS
echo "💾 Converting iconset to ICNS..."
iconutil -c icns "$ICON_SET" -o "$ICON_ICNS"

# Verify ICNS creation
if [ ! -s "$ICON_ICNS" ]; then # Check if file exists and is not empty
    echo "❌ Error: iconutil failed to create ICNS file."
    copy_generic_icon
else
    echo "✅ ICNS icon generated successfully from PNG."
fi

# Clean up temporary files
rm -rf "$ICON_SET"

# --- Critical Icon Check --- 
if [ ! -s "$ICON_ICNS" ]; then # Check if file exists and is not empty
    echo "❌ CRITICAL ERROR: No valid icon file found at $ICON_ICNS after all attempts. Aborting build."
    exit 1
fi

# --- Build Step --- 

# Ensure we have the correct index.html in src (copy from dist if needed)
if [ ! -f "src/index.html" ] && [ -f "dist/index.html" ]; then
    echo "📝 Copying fallback index.html to src..."
    cp dist/index.html src/index.html 
fi
# Ensure src/index.html exists, otherwise fail
if [ ! -f "src/index.html" ]; then
    echo "❌ CRITICAL ERROR: src/index.html not found. Cannot build." 
    exit 1
fi

# Set environment variables for build
export NODE_ENV=production
export ELECTRON_ARCH=arm64
export ELECTRON_PLATFORM=darwin

# Run the standard Electron Forge make command
echo "⚙️ Running Electron Forge build..."
npm run make -- --arch=arm64 --platform=darwin

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 DMG file created in out/make directory."
    echo "🔍 Check application logs in ~/Library/Application Support/mp3info/debug.log if needed."
else
    echo "❌ Build failed."
fi 