/*Variables de librerias library varial***/
const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
/*-------------------------------*/

/*--------------------------------------*/


let  mainWindow;

function App(){

      mainWindow = new BrowserWindow({
        width: 1028,
        height: 620,
        icon:path.join(__dirname,'/favicon.ico'),
          webPreferences:{
            nodeIntegration: false, // Deshabilita la integración de Node.js para contenido remoto
            contextIsolation: true, // Aísla el contenido del proceso principal
            preload:path.join(__dirname,'/preload.js') // Archivo de "preload" que carga antes del contenido remoto
          }
      })

      // Carga el archivo HTML de nuestra aplicación
  
    mainWindow.loadFile(path.join(__dirname,'index.html'));

  	mainWindow.webContents.openDevTools();

    mainWindow.on('close', (event) => {

    });

}
/*------------------------------------------------------*/


/*------------------------------------------------------*/
ipcMain.on('app_version', (event) => {

    mainWindow.send('app_version', { name:app.getName(), version: app.getVersion() });

});

ipcMain.on("quit",(event,arg) => { 

    console.log("Quit App")
    app.quit();

});

ipcMain.on('reset',(event,arg) => { 

	console.log("RESET APP");
    app.relaunch();
    app.quit();

});

// Evento cuando la app está lista para crear ventanas
app.on('ready', App,  Menu.setApplicationMenu(null) );

// Evento cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Evento cuando la app se activa (solo en macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    App();
  }
});
