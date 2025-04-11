#!/bin/bash

echo "🔧 Fixing and rebuilding MP3 Metadata Editor..."

# Clean up previous builds
rm -rf out/
rm -rf dist/

# Ensure we have assets directory
mkdir -p assets
mkdir -p dist

# Copy debug-main.ts to src/main.ts (using the fixed version)
cp debug-main.ts src/main.ts

# Verify icon file exists
echo "📦 Checking app icon..."
if [ ! -f "assets/icon.png" ]; then
  echo "❌ Error: Icon file not found at assets/icon.png"
  exit 1
fi

# Create fallback HTML file that will work even if the bundle fails
echo "📝 Creating fallback HTML..."
cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MP3 Metadata Editor</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: #f9fafb; 
      color: #333; 
      padding: 20px; 
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    h1 { color: #3B82F6; margin-bottom: 1rem; }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    button { 
      background: #3B82F6; 
      color: white; 
      border: none; 
      padding: 10px 15px; 
      border-radius: 4px; 
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    button:hover {
      background: #2563eb;
    }
    #metadata {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 10px;
      margin-top: 20px;
    }
    .field {
      display: flex;
      flex-direction: column;
    }
    label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    input, textarea {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    #save {
      margin-top: 20px;
    }
    #result {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>MP3 Metadata Editor</h1>
    <p>Select an MP3 file to edit its metadata.</p>
    <button id="selectFile">Select MP3 File</button>
    
    <div id="fileInfo" style="display: none;">
      <p>Currently editing: <span id="fileName"></span></p>
      
      <form id="metadata">
        <div class="field">
          <label for="title">Title</label>
          <input type="text" id="title" name="title">
        </div>
        <div class="field">
          <label for="artist">Artist</label>
          <input type="text" id="artist" name="artist">
        </div>
        <div class="field">
          <label for="album">Album</label>
          <input type="text" id="album" name="album">
        </div>
        <div class="field">
          <label for="year">Year</label>
          <input type="text" id="year" name="year">
        </div>
        <div class="field">
          <label for="genre">Genre</label>
          <input type="text" id="genre" name="genre">
        </div>
        <div class="field">
          <label for="comment">Comment</label>
          <textarea id="comment" name="comment" rows="3"></textarea>
        </div>
      </form>
      
      <button id="save">Save Changes</button>
    </div>
    
    <div id="result"></div>
  </div>

  <script>
    let currentFilePath = null;
    let currentTags = null;
    
    // Check if we have access to the Electron API
    const hasElectronAPI = window.api || window.electron;
    
    if (!hasElectronAPI) {
      document.getElementById('result').innerHTML = 
        '<div style="color: red; margin-top: 20px;">Error: Electron API not available. This application requires Electron to function properly.</div>';
    }
    
    // Use whichever API is available
    const electronAPI = window.api || window.electron;
    
    document.getElementById('selectFile').addEventListener('click', async () => {
      try {
        if (electronAPI) {
          const result = await electronAPI.selectFile();
          
          if (result.filePath) {
            currentFilePath = result.filePath;
            currentTags = result.tags || {};
            
            // Display file name
            const fileName = currentFilePath.split('/').pop();
            document.getElementById('fileName').textContent = fileName;
            document.getElementById('fileInfo').style.display = 'block';
            
            // Fill form with tags
            document.getElementById('title').value = currentTags.title || '';
            document.getElementById('artist').value = currentTags.artist || '';
            document.getElementById('album').value = currentTags.album || '';
            document.getElementById('year').value = currentTags.year || '';
            document.getElementById('genre').value = currentTags.genre || '';
            document.getElementById('comment').value = currentTags.comment?.text || '';
            
            document.getElementById('result').innerHTML = '<div style="color: green;">File loaded successfully!</div>';
          } else if (result.error) {
            document.getElementById('result').innerHTML = '<div style="color: red;">Error: ' + result.error + '</div>';
          } else if (result.canceled) {
            document.getElementById('result').innerHTML = '<div>File selection canceled.</div>';
          }
        } else {
          document.getElementById('result').innerHTML = '<div style="color: red;">Electron API not available</div>';
        }
      } catch (e) {
        document.getElementById('result').innerHTML = '<div style="color: red;">Error: ' + e.message + '</div>';
        console.error(e);
      }
    });
    
    document.getElementById('save').addEventListener('click', async () => {
      if (!currentFilePath || !electronAPI) return;
      
      try {
        const tags = {
          title: document.getElementById('title').value,
          artist: document.getElementById('artist').value,
          album: document.getElementById('album').value,
          year: document.getElementById('year').value,
          genre: document.getElementById('genre').value,
          comment: {
            language: 'eng',
            text: document.getElementById('comment').value
          }
        };
        
        const result = await electronAPI.saveTags(currentFilePath, tags);
        
        if (result.success) {
          document.getElementById('result').innerHTML = '<div style="color: green;">Changes saved successfully!</div>';
        } else if (result.error) {
          document.getElementById('result').innerHTML = '<div style="color: red;">Error: ' + result.error + '</div>';
        }
      } catch (e) {
        document.getElementById('result').innerHTML = '<div style="color: red;">Error: ' + e.message + '</div>';
        console.error(e);
      }
    });
  </script>
</body>
</html>
EOL

# Copy fallback HTML to src directory too
cp dist/index.html src/index.html

# Copy preload script to dist for redundancy
cp src/preload.ts dist/preload.ts
npx tsc dist/preload.ts --outDir dist --module commonjs --target es2020 --esModuleInterop true

# Create a simple forge config
cat > forge.config.js << 'EOL'
module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: [
      "dist",
      "assets"
    ],
    executableName: "MP3 Metadata Editor",
    arch: "arm64",
    platform: "darwin",
    icon: "./assets/icon.png",
    darwinDarkModeSupport: true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: "MP3 Metadata Editor",
        icon: "./assets/icon.png"
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.tsx',
              name: 'main_window',
              preload: {
                js: './src/preload.ts'
              }
            }
          ]
        }
      }
    }
  ]
};
EOL

# Set environment variables for ARM64
export ELECTRON_ARCH=arm64
export ELECTRON_PLATFORM=darwin
export NODE_ENV=production

# Package the application
echo "📦 Packaging the application..."
npm run make

echo "✅ Build complete!"
echo "✅ DMG file should be available in out/make directory"
echo "🔍 Check application logs in ~/Library/Application Support/mp3info/debug.log if issues persist" 