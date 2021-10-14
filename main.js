const { BrowserWindow, app, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged

// Window preferences
function createWindow() {
  const win = new BrowserWindow({
    minWidth: 600,
    minHeight: 500,
    frame: false,
    icon: path.join(__dirname, 'preload/icon/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload/preload.js')
    }
  })

  win.loadFile('build/index.html');

  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
}

// Dev only mode
const isDevEnabled = false;
if (isDev && isDevEnabled) {
  require('electron-reload' || false)(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  })
}

// Link ./build/hanlders/*.js
const handlers = fs.readdirSync('./preload/ipcMain').filter(file => file.endsWith('.js'))
for (const fileName of handlers) {
  const file = require(`./preload/ipcMain/${fileName}`);
  for (const [name, handle] of Object.entries(file)) {
    try {
      ipcMain[handle.type](name, handle.func)
    } catch {
      console.log('didn\'t add handle :', handle)
    }
  }
}

// Init 
app.whenReady().then(createWindow)