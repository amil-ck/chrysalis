const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const settings = require('electron-settings');
const fs = require('node:fs/promises');
const fsOld = require('node:fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = async () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        }
    });

    settings.configure({
        dir: getDataPath()
    })

    // Create characters folder if it doesn't exist
    try {
        if (!fsOld.existsSync(path.join(getDataPath(), "characters"))) {
            fsOld.mkdirSync(path.join(getDataPath(), "characters"));
        }
    } catch (err) {
        console.error(err);
    }

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

function handleGetUserPath() {
    return app.getPath("userData");
}

async function localStorageGet(_e, key) {
    return await settings.get(key);
}

async function localStorageSet(_e, key, value) {
    await settings.set(key, value);
}

async function writeFile(_e, path, content) {
    return await fs.writeFile(path, content, { encoding: 'utf8' })
}

async function readFile(_e, path) {
    return await fs.readFile(path, { encoding: 'utf8' });
}

function getDataPath() {
    return path.join(app.getPath("userData"), "chrysalis_data");
}

function openExternal(_e, url) {
    shell.openExternal(url);
}

async function readdir(_e, path) {
    return await fs.readdir(path);
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    ipcMain.handle("getUserPath", handleGetUserPath);
    ipcMain.handle("localStorageGet", localStorageGet);
    ipcMain.handle("localStorageSet", localStorageSet);
    ipcMain.handle("writeFile", writeFile);
    ipcMain.handle("readFile", readFile);
    ipcMain.handle("getDataPath", getDataPath);
    ipcMain.handle("openExternal", openExternal);
    ipcMain.handle("readdir", readdir);

    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
