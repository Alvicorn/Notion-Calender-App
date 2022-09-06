require("dotenv").config();

const { app, BrowserWindow } = require("electron");

const server = require("./app");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // mainWindow.loadURL("http://localhost:8000");
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
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