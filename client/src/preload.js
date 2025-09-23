// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getUserPath: () => ipcRenderer.invoke("getUserPath"),
  writeFile: (path, content) => ipcRenderer.invoke("writeFile", path, content),
  readFile: (path) => ipcRenderer.invoke("readFile", path),
  deleteFile: (path) => ipcRenderer.invoke("deleteFile", path), // TODO: find out if this is dangerous??
  getDataPath: () => ipcRenderer.invoke("getDataPath"),
  openExternal: (url) => ipcRenderer.invoke("openExternal", url),
  readdir: (path) => ipcRenderer.invoke("readdir", path),
  showOpenDialog: (options) => ipcRenderer.invoke("showOpenDialog", options),
  showSaveDialog: (options) => ipcRenderer.invoke("showSaveDialog", options)
});

contextBridge.exposeInMainWorld('appSettings', {
    set: (key, value) => ipcRenderer.invoke("localStorageSet", key, value),
    get: (key) => ipcRenderer.invoke("localStorageGet", key),
})