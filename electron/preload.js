const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  launchShell: () => ipcRenderer.send('launch-shell'), // Изменено на send (синхронный)
  launchGame: (executablePath) => ipcRenderer.send('launch-game', executablePath), // Изменено на send
});
