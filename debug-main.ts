import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as NodeID3 from 'node-id3';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Debug info
function logDebug(message: string) {
  console.log(`[DEBUG] ${message}`);
  try {
    fs.appendFileSync(path.join(app.getPath('userData'), 'debug.log'), `${message}\n`);
  } catch (e) {
    console.error('Could not write to debug log', e);
  }
}

function createWindow() {
  // Debug app paths
  const appPath = app.getAppPath();
  logDebug(`App path: ${appPath}`);
  
  // Find correct preload script path
  let preloadPath = '';
  const possiblePreloadPaths = [
    path.join(appPath, 'preload.js'),
    path.join(appPath, '.webpack', 'main', 'preload.js'),
    path.join(appPath, 'dist', 'preload.js'),
    path.join(__dirname, 'preload.js'),
  ];
  
  for (const testPath of possiblePreloadPaths) {
    logDebug(`Testing preload path: ${testPath}`);
    if (fs.existsSync(testPath)) {
      preloadPath = testPath;
      logDebug(`Using preload path: ${preloadPath}`);
      break;
    }
  }
  
  if (!preloadPath) {
    logDebug('No preload path found! Using fallback.');
    preloadPath = path.join(__dirname, 'preload.js');
  }
  
  // Create the browser window with minimal settings
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    backgroundColor: '#FFFFFF',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      devTools: true,
    },
  });
  
  // Find correct HTML file path
  let htmlPath = '';
  const possibleHtmlPaths = [
    path.join(appPath, 'index.html'),
    path.join(appPath, '.webpack', 'renderer', 'main_window', 'index.html'),
    path.join(appPath, '.webpack', 'main', 'index.html'),
    path.join(appPath, 'dist', 'index.html'),
    path.join(__dirname, '..', 'renderer', 'index.html'),
    path.join(__dirname, 'index.html'),
  ];
  
  for (const testPath of possibleHtmlPaths) {
    logDebug(`Testing HTML path: ${testPath}`);
    if (fs.existsSync(testPath)) {
      htmlPath = testPath;
      logDebug(`Using HTML path: ${htmlPath}`);
      break;
    }
  }
  
  if (!htmlPath) {
    logDebug('No HTML path found! Using fallback.');
    htmlPath = path.join(__dirname, 'index.html');
  }

  // Load the HTML file
  try {
    logDebug(`Attempting to load file: ${htmlPath}`);
    mainWindow.loadFile(htmlPath);
  } catch (error) {
    logDebug(`Error loading file: ${error}`);
    // Fallback to a basic HTML content if the file can't be loaded
    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <html>
        <head>
          <title>MP3 Metadata Editor</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: white; color: #333; padding: 20px; }
            h1 { color: #3B82F6; }
            button { background: #3B82F6; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1>MP3 Metadata Editor</h1>
          <p>There was an issue loading the application interface.</p>
          <button id="selectFile">Select MP3 File</button>
          <div id="result"></div>
          <script>
            document.getElementById('selectFile').addEventListener('click', async () => {
              try {
                if (window.electron) {
                  const result = await window.electron.selectFile();
                  document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                } else {
                  document.getElementById('result').innerHTML = 'Electron API not available';
                }
              } catch (e) {
                document.getElementById('result').innerHTML = 'Error: ' + e.message;
              }
            });
          </script>
        </body>
      </html>
    `);
  }

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle file selection
ipcMain.handle('select-file', async () => {
  if (!mainWindow) return { canceled: true };

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'MP3 Files', extensions: ['mp3'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      const tags = NodeID3.read(filePath);
      return { filePath, tags };
    } catch (error) {
      return { error: `Failed to read tags: ${error}` };
    }
  }

  return result;
});

// Handle saving tags
ipcMain.handle('save-tags', async (_, { filePath, tags }) => {
  try {
    const success = NodeID3.write(tags, filePath);
    return { success };
  } catch (error) {
    return { error: `Failed to save tags: ${error}` };
  }
}); 