import { contextBridge, ipcRenderer } from 'electron';

// Expose IPC functions to the renderer process
contextBridge.exposeInMainWorld('api', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveTags: (filePath: string, tags: any) => ipcRenderer.invoke('save-tags', { filePath, tags }),
}); 