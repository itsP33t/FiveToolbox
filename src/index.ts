/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
// conf
const port = 65414;
const version = "1.0.3";
//
// auto updating
const { autoUpdater } = require("electron-updater");
//
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1270,
    height: 650,
    autoHideMenuBar: true,
    icon: "ico.ico",
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:" + port);
  mainWindow.focus();
  // disable menuBar
  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools(); -- No need for that right now
};
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Express Server Running the entire core
const backend = express();
backend.set("view engine", "ejs");
backend.use(bodyParser.urlencoded({ extended: true }));

backend.set("views", __dirname + "/views/");
backend.use(express.static(__dirname + "/views/"));

if (!fs.existsSync("/fivet_config")) {
  fs.writeFileSync("./fivet_config", "Not set");
}

// Dir config
const configfile = fs.readFileSync("./fivet_config", "utf8");
//

// Frontend Routes
backend.get("/", (req, res) => {
  const fivet_config = fs.readFileSync("./fivet_config", "utf8");
  res.render("index", { fivet_config: fivet_config, version: version });
});

backend.get("/settings", (req, res) => {
  res.render("settings");
});

// Backend
backend.post("/savesettings", (req, res) => {
  const data = req.body.fivemlocation;
  const data2 = data.replace(/\\/g, "/");
  fs.writeFileSync("fivet_config", data2);
  res.redirect("/success");
});

backend.get("/cachedel", (req, res) => {
  const configfile = fs.readFileSync("./fivet_config", "utf8");
  fs.readFile(configfile, "utf8", (err, data) => {
    if (err) {
      console.log("Error while reading file", err);
    }
    if (data == "") {
      res.redirect("/settings");
    }
  });
  const fivemlocation = configfile;
  const dir = fivemlocation + "/FiveM.app/data/cache";
  const dir2 = fivemlocation + "/FiveM.app/data/server-cache";
  const dir3 = fivemlocation + "/FiveM.app/data/server-cache-priv";
  const dir4 = fivemlocation + "/FiveM.app/data/server-cache-fxdk";
  // delete dir and dir2
  fs.rmdir(dir, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.rmdir(dir2, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.rmdir(dir3, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.rmdir(dir4, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.render("cache-deleter");
});

backend.get("/crashesdel", (req, res) => {
  const crashesdir = configfile + "/FiveM.app/crashes";
  fs.rmdir(crashesdir, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.render("crashes-deleter");
});

backend.get("/logsdel", (req, res) => {
  const logsdir = configfile + "/FiveM.app/logs";
  fs.rmdir(logsdir, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.render("logs-deleter");
});

backend.listen(port, () => {
  console.log("Server is running. http://localhost:" + port);
});
