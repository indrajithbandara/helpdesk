const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({icon: path.join(__dirname, '/res/icon.png')})
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))
    
    mainWindow.maximize()
    mainWindow.on('close', function () {mainWindow = null})

    //Comment:
    mainWindow.webContents.openDevTools()
    
    //Uncomment:
    //mainWindow.setMenu(null)
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    }
)

if (shouldQuit) {
    app.quit()
}

app.on('ready', createWindow)

//Nice:
app.disableHardwareAcceleration()

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit()
})

app.on('activate', function () {
    if (mainWindow === null)
        createWindow()
})