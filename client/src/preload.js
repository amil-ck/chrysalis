// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getUserPath: () => ipcRenderer.invoke("getUserPath"),
  writeFile: (path, content) => ipcRenderer.invoke("writeFile", path, content),
  readFile: (path) => ipcRenderer.invoke("readFile", path),
  getDataPath: () => ipcRenderer.invoke("getDataPath"),
  openExternal: (url) => ipcRenderer.invoke("openExternal", url)
});

contextBridge.exposeInMainWorld('appSettings', {
    set: (key, value) => ipcRenderer.invoke("localStorageSet", key, value),
    get: (key) => ipcRenderer.invoke("localStorageGet", key),
})