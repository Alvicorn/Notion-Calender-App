require("dotenv").config();
const electron = require("electron");
require("electron-reload")(__dirname);

const { app, BrowserWindow, ipcMain } = require("electron");
// const { app, BrowserWindow } = require("electron");
const { setDatabase, getTags } = require('./notion')


const server = require("./app");
const fs = require('fs');
const dnsServer = "www.google.com"

filename = "data/IDs.json";
let mainWindow;


async function checkInternet() {
    let connected = false;
    // check internet connection
    require('dns').resolve(dnsServer, err => {
        if (!err) {
            internetConnection = true;
            console.log("Connected to internet");
        }
      });
    return connected;
}

async function loadDB() {
    let loaded = false;
    let internetConnection = new Promise ((resolve, reject) => {
        let connection = checkInternet();
        if (connection) {
            resolve();
        } else {
            reject("Can not connect to internet");
        }
    });
    
    internetConnection.then(() => {
        if (!fs.existsSync(filename)) {
            console.log("writing database info")
            setDatabase();
        } else {
            console.log(filename + " exists");
        }
        loaded = true;
    });

    internetConnection.catch((message) => {
        console.log(message);
    })

    return loaded;
}

function createWindow() {
    
    let startUp = new Promise((resolve, reject) => {
        let dbConnection = loadDB();
        if (dbConnection) {
            resolve("Connected to the Notion DB");
        } else {
            reject("Not connected to the Notion DB");
        }
    });
    
    startUp.then((message) => {
        console.log(message);
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
                // nodeIntegration: true, // is default value after Electron v5
                // contextIsolation: true, // protect against prototype pollution
                // enableRemoteModule: false, // turn off remote
                // preload: __dirname + "/scripts/preload.js" // use a preload script
            }
        });
        // mainWindow.webContents.send("Tags", "hello");
        // mainWindow.loadURL("http://localhost:8000");
        mainWindow.loadURL(`http://localhost:${process.env.PORT}`);
        mainWindow.setMenuBarVisibility(false)

        mainWindow.on("closed", () => {
            mainWindow = null;
        });

        ipcMain.on("Tags", (event, args) => {
            // Send result back to renderer process
            win.webContents.send("Tags", getTags());    
        });

    });

    startUp.catch((message) => {
        console.log(message);
    })


}

app.on("ready", createWindow);



app.on("resize", (e,x,y) => {
    mainWindow.setSize(x,y);
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit;
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});








// end of main.js