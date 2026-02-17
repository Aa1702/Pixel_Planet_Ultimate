const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {

  const win = new BrowserWindow({
    width: 480,       
    height: 700,       
    frame: false,      
    transparent: true, 
    resizable: false,  
    hasShadow: true,
    icon: path.join(__dirname, 'assets/icon.png'), 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false 
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});