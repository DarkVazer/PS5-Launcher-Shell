const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let shellWindow = null;

function createLauncherWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Game Launcher',
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173/launcher.html');
  } else {
    win.loadFile(path.join(__dirname, '../dist/launcher.html'));
  }

  win.webContents.openDevTools();

  return win;
}

function createShellWindow() {
  if (shellWindow) return;

  shellWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#000000',
    alwaysOnTop: false,
  });

  if (process.env.NODE_ENV === 'development') {
    shellWindow.loadURL('http://localhost:5173');
  } else {
    shellWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  shellWindow.on('minimize', (event) => {
    event.preventDefault();
  });

  shellWindow.on('closed', () => {
    shellWindow = null;
  });
}

app.whenReady().then(() => {
  createLauncherWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLauncherWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-games', () => {
  const gamesPath = path.join(__dirname, '../games.json');
  if (!fs.existsSync(gamesPath)) {
    fs.writeFileSync(gamesPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(gamesPath));
});

ipcMain.handle('add-game', (event, game) => {
  const gamesPath = path.join(__dirname, '../games.json');
  const games = JSON.parse(fs.readFileSync(gamesPath));
  games.push(game);
  fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
  return games;
});

ipcMain.handle('launch-shell', () => {
  createShellWindow();
});

ipcMain.handle('launch-game', (event, executablePath) => {
  shell.openPath(executablePath).catch((err) => {
    console.error('Error launching game:', err);
  });
});