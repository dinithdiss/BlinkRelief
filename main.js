const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'));
  mainWindow.minimize();
}

// create browser windows.
app.whenReady().then(() => {
  createWindow();
  createTray();
  // Execute every 20 minutes
  setInterval(schedulePopup, 20 * 60 * 1000);
});

// Quit when all windows are closed,
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// dock icon
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function schedulePopup() {
  // Check if the app is minimized
  if (mainWindow.isMinimized()) {
    // Maximize the app
    mainWindow.maximize();
  }

  // Create a new BrowserWindow for the popup
  const popupWindow = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the popup HTML file
  popupWindow.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Auto-close the popup
  setTimeout(() => {
    popupWindow.close();
  }, 25000);
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'loading-42.png')); // Replace 'tray-icon.png' with the path to your tray icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Interval');
  tray.setContextMenu(contextMenu);
}
