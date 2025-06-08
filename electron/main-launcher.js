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
    win.webContents.openDevTools(); // Для отладки
  } else {
    const launcherPath = path.join(__dirname, '../dist/launcher.html');
    console.log('Loading launcher:', launcherPath);
    win.loadFile(launcherPath).catch((err) => {
      console.error('Failed to load launcher.html:', err);
    });
  }

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
    shellWindow.webContents.openDevTools(); // Для отладки
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading index:', indexPath);
    shellWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load index.html:', err);
    });
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
  const gamesPath = path.join(app.getPath('userData'), 'games.json');
  console.log('Reading games.json:', gamesPath);
  if (!fs.existsSync(gamesPath)) {
    fs.writeFileSync(gamesPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(gamesPath));
});

ipcMain.handle('add-game', (event, game) => {
  const gamesPath = path.join(app.getPath('userData'), 'games.json');
  console.log('Writing to games.json:', gamesPath);
  let games = [];
  if (fs.existsSync(gamesPath)) {
    games = JSON.parse(fs.readFileSync(gamesPath));
  }
  games.push(game);
  fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
  return games;
});

ipcMain.on('launch-shell', () => {
  console.log('Launching shell');
  createShellWindow();
});

ipcMain.on('launch-game', (event, executablePath) => {
  console.log('Launching game:', executablePath);
  shell.openPath(executablePath).catch((err) => {
    console.error('Error launching game:', err);
  });
});
