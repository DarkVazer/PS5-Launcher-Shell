const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let shellWindow = null;

function createLauncherWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Для разработки, убрать в продакшене
    },
    title: 'Game Launcher',
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173/launcher.html');
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
      webSecurity: false, // Для разработки, убрать в продакшене
    },
    backgroundColor: '#000000',
    alwaysOnTop: false,
  });

  if (process.env.NODE_ENV === 'development') {
    shellWindow.loadURL('http://localhost:5173');
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

const getGames = () => {
  const gamesPath = path.join(app.getPath('userData'), 'GameLauncher', 'games.json');
  console.log('Reading games.json:', gamesPath);
  if (!fs.existsSync(gamesPath)) {
    fs.mkdirSync(path.dirname(gamesPath), { recursive: true });
    fs.writeFileSync(gamesPath, JSON.stringify([]));
  }
  const games = JSON.parse(fs.readFileSync(gamesPath));
  return games.map((game) => {
    try {
      const result = { ...game };
      if (game.cover && fs.existsSync(game.cover)) {
        const ext = path.extname(game.cover).slice(1);
        result.cover = `data:image/${ext};base64,${fs.readFileSync(game.cover).toString('base64')}`;
      } else {
        result.cover = '';
      }
      if (game.titleLogo && fs.existsSync(game.titleLogo)) {
        const ext = path.extname(game.titleLogo).slice(1);
        result.titleLogo = `data:image/${ext};base64,${fs.readFileSync(game.titleLogo).toString('base64')}`;
      } else {
        result.titleLogo = result.cover;
      }
      return result;
    } catch (err) {
      console.error(`Error processing game ${game.name}:`, err);
      return { ...game, cover: '', titleLogo: '' };
    }
  });
};

ipcMain.handle('get-games', () => {
  return getGames();
});

ipcMain.handle('add-game', async (event, game) => {
  const gamesDir = path.join(app.getPath('userData'), 'GameLauncher', 'Games');
  const gamesPath = path.join(app.getPath('userData'), 'GameLauncher', 'games.json');
  fs.mkdirSync(gamesDir, { recursive: true });

  let games = [];
  if (fs.existsSync(gamesPath)) {
    games = JSON.parse(fs.readFileSync(gamesPath));
  }

  try {
    const newGame = {
      name: game.name,
      cover: '',
      titleLogo: '',
      executable: game.executable || '',
      description: game.description || '',
    };

    if (game.cover) {
      const coverExt = path.extname(game.cover);
      const coverName = `${uuidv4()}${coverExt}`;
      newGame.cover = path.join(gamesDir, coverName);
      fs.copyFileSync(game.cover, newGame.cover);
      console.log(`Copied cover to: ${newGame.cover}`);
    }

    if (game.titleLogo) {
      const titleLogoExt = path.extname(game.titleLogo);
      const titleLogoName = `${uuidv4()}${titleLogoExt}`;
      newGame.titleLogo = path.join(gamesDir, titleLogoName);
      fs.copyFileSync(game.titleLogo, newGame.titleLogo);
      console.log(`Copied title logo to: ${newGame.titleLogo}`);
    }

    games.push(newGame);
    fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
    console.log('Added game to games.json:', gamesPath);

    const updatedGames = getGames();
    if (shellWindow) {
      shellWindow.webContents.send('games-updated', updatedGames);
    }
    return updatedGames;
  } catch (err) {
    console.error('Error adding game:', err);
    throw err;
  }
});

ipcMain.handle('add-games', async (event, newGames) => {
  const gamesDir = path.join(app.getPath('userData'), 'GameLauncher', 'Games');
  const gamesPath = path.join(app.getPath('userData'), 'GameLauncher', 'games.json');
  fs.mkdirSync(gamesDir, { recursive: true });

  let games = [];
  if (fs.existsSync(gamesPath)) {
    games = JSON.parse(fs.readFileSync(gamesPath));
  }

  try {
    for (const game of newGames) {
      const newGame = {
        name: game.name,
        cover: '',
        titleLogo: '',
        executable: game.executable || '',
        description: game.description || '',
      };

      if (game.cover) {
        const coverExt = path.extname(game.cover);
        const coverName = `${uuidv4()}${coverExt}`;
        newGame.cover = path.join(gamesDir, coverName);
        fs.copyFileSync(game.cover, newGame.cover);
        console.log(`Copied cover to: ${newGame.cover}`);
      }

      if (game.titleLogo) {
        const titleLogoExt = path.extname(game.titleLogo);
        const titleLogoName = `${uuidv4()}${titleLogoExt}`;
        newGame.titleLogo = path.join(gamesDir, titleLogoName);
        fs.copyFileSync(game.titleLogo, newGame.titleLogo);
        console.log(`Copied title logo to: ${newGame.titleLogo}`);
      }

      games.push(newGame);
    }

    fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
    console.log('Added games to games.json:', gamesPath);

    const updatedGames = getGames();
    if (shellWindow) {
      shellWindow.webContents.send('games-updated', updatedGames);
    }
    return updatedGames;
  } catch (err) {
    console.error('Error adding games:', err);
    throw err;
  }
});

ipcMain.handle('update-game', async (event, { index, game }) => {
  const gamesDir = path.join(app.getPath('userData'), 'GameLauncher', 'Games');
  const gamesPath = path.join(app.getPath('userData'), 'GameLauncher', 'games.json');
  let games = [];
  if (fs.existsSync(gamesPath)) {
    games = JSON.parse(fs.readFileSync(gamesPath));
  }

  if (index >= 0 && index < games.length) {
    try {
      const existingGame = games[index];
      const updatedGame = {
        name: game.name,
        cover: existingGame.cover,
        titleLogo: existingGame.titleLogo,
        executable: game.executable || '',
        description: game.description || '',
      };

      if (game.cover && game.cover !== existingGame.cover) {
        if (fs.existsSync(existingGame.cover)) {
          fs.unlinkSync(existingGame.cover);
        }
        const coverExt = path.extname(game.cover);
        const coverName = `${uuidv4()}${coverExt}`;
        updatedGame.cover = path.join(gamesDir, coverName);
        fs.copyFileSync(game.cover, updatedGame.cover);
        console.log(`Copied new cover to: ${updatedGame.cover}`);
      }

      if (game.titleLogo && game.titleLogo !== existingGame.titleLogo) {
        if (fs.existsSync(existingGame.titleLogo)) {
          fs.unlinkSync(existingGame.titleLogo);
        }
        const titleLogoExt = path.extname(game.titleLogo);
        const titleLogoName = `${uuidv4()}${titleLogoExt}`;
        updatedGame.titleLogo = path.join(gamesDir, titleLogoName);
        fs.copyFileSync(game.titleLogo, updatedGame.titleLogo);
        console.log(`Copied new title logo to: ${updatedGame.titleLogo}`);
      }

      games[index] = updatedGame;
      fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
      console.log('Updated game in games.json:', gamesPath);

      const updatedGames = getGames();
      if (shellWindow) {
        shellWindow.webContents.send('games-updated', updatedGames);
      }
      return updatedGames;
    } catch (err) {
      console.error('Error updating game:', err);
      throw err;
    }
  }
  return games;
});

ipcMain.handle('delete-game', async (event, index) => {
  const gamesPath = path.join(app.getPath('userData'), 'GameLauncher', 'games.json');
  let games = [];
  if (fs.existsSync(gamesPath)) {
    games = JSON.parse(fs.readFileSync(gamesPath));
  }

  if (index >= 0 && index < games.length) {
    const game = games[index];
    if (game.cover && fs.existsSync(game.cover)) {
      fs.unlinkSync(game.cover);
      console.log(`Deleted cover: ${game.cover}`);
    }
    if (game.titleLogo && fs.existsSync(game.titleLogo)) {
      fs.unlinkSync(game.titleLogo);
      console.log(`Deleted title logo: ${game.titleLogo}`);
    }
    games.splice(index, 1);
    fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
    console.log('Deleted game from games.json:', gamesPath);

    const updatedGames = getGames();
    if (shellWindow) {
      shellWindow.webContents.send('games-updated', updatedGames);
    }
    return updatedGames;
  }

  return games;
});

ipcMain.handle('scan-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (result.canceled || !result.filePaths.length) return [];

  const dir = result.filePaths[0];
  const games = [];
  const imageExts = ['.png', '.jpg', '.jpeg', '.gif'];
  const exeFiles = fs.readdirSync(dir).filter((file) => path.extname(file).toLowerCase() === '.exe');

  for (const exe of exeFiles) {
    const gameName = path.basename(exe, '.exe');
    const game = { name: gameName, executable: path.join(dir, exe), cover: '', titleLogo: '', description: '' };
    
    const images = fs.readdirSync(dir).filter((file) => imageExts.includes(path.extname(file).toLowerCase()));
    const coverImage = images.find((img) => img.toLowerCase().includes(gameName.toLowerCase()) || img.toLowerCase().includes('cover'));
    if (coverImage) {
      game.cover = path.join(dir, coverImage);
    }

    games.push(game);
  }

  if (games.length > 0) {
    const { response, checkboxChecked } = await dialog.showMessageBox({
      type: 'info',
      title: 'Found Games',
      message: `Found ${games.length} game(s):\n${games.map((g) => g.name).join('\n')}`,
      buttons: ['Add All', 'Cancel'],
      checkboxLabel: 'Add selected games',
    });

    if (response === 0) {
      return games;
    }
  }
  return [];
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

ipcMain.handle('select-file', async (event, options) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: options.filters || [],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
