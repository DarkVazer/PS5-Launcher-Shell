const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  launchShell: () => ipcRenderer.invoke('launch-shell'),
  launchGame: (executablePath) => ipcRenderer.invoke('launch-game', executablePath),
});