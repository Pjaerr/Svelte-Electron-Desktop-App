const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  ipcMain,
  dialog
} = require("electron");
const fs = require("fs");

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const openFile = () => {
    const file = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Markdown Files", extensions: ["md"] }]
    });

    if (file) {
      fs.readFile(file[0], "utf8", (err, data) => {
        if (err) return;

        mainWindow.webContents.send("fileopened", {
          path: file[0],
          content: data
        });
      });
    }
  };

  const createNewFile = content => {
    dialog
      .showSaveDialog({
        title: "Create New File",
        properties: ["showOverwriteConfirmation"],
        filters: [
          {
            name: "Markdown Files",
            extensions: ["md"]
          }
        ]
      })
      .then(({ canceled, filePath }) => {
        if (canceled) return;

        fs.writeFile(filePath, content, err => {
          if (err) return;

          mainWindow.webContents.send("fileopened", {
            path: filePath,
            content
          });
        });
      });
  };

  //Setup Menu Items
  const menu = new Menu();

  menu.append(
    new MenuItem({
      label: "Open",
      accelerator: "CmdOrCtrl+O",
      click: openFile
    })
  );

  menu.append(
    new MenuItem({
      label: "Save",
      accelerator: "CmdOrCtrl+S",
      click: () => mainWindow.webContents.send("savefile")
    })
  );

  menu.append(
    new MenuItem({
      label: "Create New File",
      accelerator: "CmdOrCtrl+N",
      click: () =>
        createNewFile(
          "# You can enter markdown here\n\n**This text is bold**\n\n_This text is italic_"
        )
    })
  );

  //Setup Message Listeners
  ipcMain.on("saveexistingfile", (e, { path, content }) => {
    fs.writeFile(path, content, err => {
      if (err) return;
    });
  });

  ipcMain.on("savenewfile", (e, content) => {
    createNewFile(content);
  });

  Menu.setApplicationMenu(menu);
  mainWindow.loadFile("./public/index.html");
});

app.on("window-all-closed", () => {
  app.quit();
});
