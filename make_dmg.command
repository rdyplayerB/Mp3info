#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

echo "Building DMG file using Electron Forge..."
./node_modules/.bin/electron-forge make

echo "Process completed. If successful, your DMG should be in the out/make/dmg/ directory."
echo "Press any key to exit."
read -n 1 