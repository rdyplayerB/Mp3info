#!/bin/bash

echo "Building MP3 Metadata Editor DMG for Apple Silicon (M1/M2)..."
echo "This process may take a few minutes. Please wait..."

# Clean previous builds if any
rm -rf out/

# Set environment variables for ARM64 architecture
export ELECTRON_ARCH=arm64

# Build the application with Electron Forge
npm run make -- --arch=arm64 --platform=darwin

echo "✓ Build complete!"
echo "✓ DMG file created with modern UI optimized for Apple Silicon"
echo "✓ Find your DMG in the 'out/make' directory" 