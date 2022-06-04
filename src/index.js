const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
// conf
const port = 65414;
//



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1270,
    height: 650,
    autoHideMenuBar: true,
    icon: 'ico.ico'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:'+port);
  mainWindow.focus();

  // Open the DevTools.
 // mainWindow.webContents.openDevTools(); -- No need for that right now
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// Express Server Running the entire core


const bodyParser = require("body-parser");
const express = require('express'); 
const backend = express();
backend.set('view engine', 'ejs')
//create index.ejs
backend.use(bodyParser.urlencoded({extended: true}));

backend.set('views', __dirname + '/views/');
backend.use(express.static(__dirname + '/views/'));

// Frontend Routes
backend.get('/', (req, res) => {
res.render('index')
});

backend.get('/settings', (req, res) => {
  res.render('settings')
  });

// backend.get('/cachedel', (req, res) => {
//   res.render('cache-deleter')
//   });

  const alert = require("alert");

  // Backend

  backend.post('/savesettings', (req, res) => {
    // create a file named fivet_config and write the data in there
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'fivet_config');
    const data = req.body.fivemlocation;
    fs.writeFile(filePath, data, err => {
      if (err) {
        console.log("Error while saving file", err);
      }
    });
    res.redirect('/');
    res.send(alert("Settings Saved"));
    
    
  }

    );

  backend.get('/test', (req, res) => {
  // read "fivet_config" file and send it to the frontend
  const fs = require('fs');
  const path = require('path');
  const __filePath = path.join(__dirname, 'fivet_config');
  fs.readFile(__filePath, 'utf8', (err, data) => {
    if (err) {
      console.log("Error while reading file", err);
    }
    res.send(data);
  })
  });


  backend.get('/cachedel', (req, res) => {
    // navigate to the location specidfied in file "fivet_config", go to "FiveM Application Data" then go to "/data" and delete folder with names: "cache" and "server-cache"
    // read fivet_config and if it's missing or empty then redirect to settings page
    const _filePath = path.join(__dirname, 'fivet_config');
    fs.readFile(_filePath, 'utf8', (err, data) => {
    if (err) {
      console.log("Error while reading file", err);
    }
    if (data == "") {
      res.redirect("/settings");
    }
  })
    
    
    
    const filePath = path.join(__dirname, 'fivet_config');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log("Error while reading file", err);
      }
      const fivemlocation = data;
      // const exec = require('child_process').exec;
      // const cmd = `cd ${fivemlocation} && cd data && rm -rf cache && rm -rf server-cache`;
      // exec(cmd, (err, stdout, stderr) => {
      //   if (err) {
      //     console.log("error")
      //   }
      //   res.send("Cache Deleted");
      // });
      
      const dir = fivemlocation + "/FiveM.app/data/cache"
      const dir2 = fivemlocation + "/FiveM.app/data/server-cache"
      const dir3 = fivemlocation + "/FiveM.app/data/server-cache-priv"
      const dir4 = fivemlocation + "/FiveM.app/data/server-cache-fxdk"
      // delete dir and dir2
      fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
          console.log(err)
        }
      }
      )
      fs.rmdir(dir2, { recursive: true }, (err) => {
        if (err) {
          console.log(err)
        }
      }
      )
      fs.rmdir(dir3, { recursive: true }, (err) => {
        if (err) {
          console.log(err)
        }
      }
      )
      fs.rmdir(dir4, { recursive: true }, (err) => {
        if (err) {
          console.log(err)
        }
      }
      )
      res.render("cache-deleter")
    })

    



});



backend.listen(port, () => {
console.log('Server is running. http://localhost:' + port);
})