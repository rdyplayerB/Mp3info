#!/bin/bash

echo "🏗️ Building MP3 Metadata Editor for Apple Silicon (M1/M2)..."

# Clean previous builds
rm -rf out/ dist/

# Create assets directory if it doesn't exist
mkdir -p assets

# --- Icon Generation --- 
ICON_SVG="assets/icon.svg"
ICON_ICNS="assets/icon.icns"
ICON_PNG="assets/icon-temp.png"
ICON_SET="assets/icon.iconset"
GENERIC_ICON="/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns"

# Create SVG icon file (if it doesn't exist)
if [ ! -f "$ICON_SVG" ]; then
  echo "🎨 Creating default SVG icon..."
cat > "$ICON_SVG" << 'EOL'
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="120" fill="#3B82F6"/>
  <text x="256" y="230" font-family="Arial, sans-serif" font-size="90" font-weight="bold" fill="white" text-anchor="middle">MP3</text>
  <path d="M350 280 L350 170 L260 200 L260 310 C260 310 260 340 230 340 C200 340 200 310 200 310 C200 310 200 280 230 280 C245 280 255 290 260 300 L260 200" 
        stroke="white" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="150" y1="380" x2="362" y2="380" stroke="white" stroke-width="15" stroke-linecap="round"/>
  <line x1="150" y1="420" x2="300" y2="420" stroke="white" stroke-width="15" stroke-linecap="round"/>
</svg>
EOL
fi

echo "📦 Generating ICNS icon..."

# Function to copy generic icon as fallback
copy_generic_icon() {
    echo "ℹ️ Using generic system icon as fallback."
    cp "$GENERIC_ICON" "$ICON_ICNS"
}

# Attempt SVG to PNG conversion
png_created=false
if command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w 1024 -h 1024 "$ICON_SVG" > "$ICON_PNG" && png_created=true
elif command -v inkscape &> /dev/null; then
    inkscape --export-type=png --export-width=1024 --export-height=1024 --export-filename="$ICON_PNG" "$ICON_SVG" && png_created=true
elif command -v convert &> /dev/null; then 
    convert -background none -size 1024x1024 "$ICON_SVG" "$ICON_PNG" && png_created=true
fi

# If PNG conversion succeeded, create ICNS from it
if $png_created && [ -f "$ICON_PNG" ]; then
    echo "🖼️ PNG created from SVG. Generating iconset..."
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
        echo "✅ ICNS icon generated successfully from SVG."
    fi
    
    # Clean up temporary files
    rm "$ICON_PNG"
    rm -rf "$ICON_SET"
else
    # If PNG conversion failed
    echo "⚠️ Warning: Failed to convert SVG to PNG. No SVG conversion tool (rsvg-convert, inkscape, convert) found or conversion failed."
    copy_generic_icon
fi

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