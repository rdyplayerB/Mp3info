import { app, BrowserWindow, ipcMain, dialog, session, nativeTheme } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as NodeID3 from 'node-id3';

// Declare webpack constants
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

// Log for debugging
function logDebug(message: string) {
  console.log(`[DEBUG] ${message}`);
  try {
    fs.appendFileSync(path.join(app.getPath('userData'), 'debug.log'), `${new Date().toISOString()} - ${message}\n`);
  } catch (e) {
    console.error('Could not write to debug log', e);
  }
}

logDebug('App starting...');

// Enable hardware acceleration (keeping optimizations)
app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform');
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode');
app.commandLine.appendSwitch('enable-accelerated-video');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-background-timer-throttling');

function createWindow() {
  logDebug('Creating window...');
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    show: false, // Don't show until ready-to-show
    titleBarStyle: 'default', // Use default style for stability
    backgroundColor: '#FFFFFF', // Set background
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Use Forge constant
      spellcheck: false,
      backgroundThrottling: false,
      devTools: process.env.NODE_ENV === 'development', // Enable dev tools in dev
    },
  });

  mainWindow.once('ready-to-show', () => {
    logDebug('Window ready to show.');
    mainWindow?.show();
  });

  // Load the index.html of the app using the Forge constant.
  logDebug(`Loading entry: ${MAIN_WINDOW_WEBPACK_ENTRY}`);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open DevTools only in development
  if (process.env.NODE_ENV === 'development') {
    logDebug('Opening DevTools.');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    logDebug('Main window closed.');
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  logDebug('App ready.');
  nativeTheme.themeSource = 'system';
  createWindow();
});

app.on('window-all-closed', () => {
  logDebug('All windows closed.');
  if (process.platform !== 'darwin') {
    logDebug('Quitting app.');
    app.quit();
  }
});

app.on('activate', () => {
  logDebug('App activated.');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers (remain the same)
ipcMain.handle('select-file', async () => {
  logDebug('IPC select-file called');
  if (!mainWindow) return { canceled: true };
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'MP3 Files', extensions: ['mp3'] }],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      const tags = NodeID3.read(filePath);
      logDebug(`Read tags for ${filePath}`);
      return { filePath, tags };
    } catch (error: any) {
      logDebug(`Error reading tags for ${filePath}: ${error.message}`);
      return { error: `Failed to read tags: ${error.message}` };
    }
  }
  logDebug('File selection canceled or no file selected.');
  return result;
});

ipcMain.handle('save-tags', async (_, { filePath, tags }) => {
  logDebug(`IPC save-tags called for ${filePath}`);
  try {
    const success = NodeID3.write(tags, filePath);
    logDebug(`Tags saved successfully: ${success}`);
    return { success };
  } catch (error: any) {
    logDebug(`Error saving tags for ${filePath}: ${error.message}`);
    return { error: `Failed to save tags: ${error.message}` };
  }
}); 