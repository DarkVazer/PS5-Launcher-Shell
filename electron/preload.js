const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  addGames: (games) => ipcRenderer.invoke('add-games', games),
  updateGame: (data) => ipcRenderer.invoke('update-game', data),
  deleteGame: (index) => ipcRenderer.invoke('delete-game', index),
  scanDirectory: () => ipcRenderer.invoke('scan-directory'),
  launchShell: () => ipcRenderer.send('launch-shell'),
  launchGame: (executablePath) => ipcRenderer.send('launch-game', executablePath),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  onGamesUpdated: (callback) => ipcRenderer.on('games-updated', (event, games) => callback(games)),
});
