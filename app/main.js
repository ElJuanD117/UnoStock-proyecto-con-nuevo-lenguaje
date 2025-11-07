/*Variables de librerias library varial***/
const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

/*--------------------------------------*/
const UnoStockDB = require(path.join(__dirname,'./BD/UnoStockManager.js'))
let DB_Path = path.join(__dirname,'/BD/UnoStock.db');
const DB = new UnoStockDB(DB_Path);
/*--------------------------------------*/
const {Info_Producto} = require(path.join(__dirname,'./Productos/Informacion/Informacion'));
const {Registro_Producto} = require(path.join(__dirname,'./Productos/Registro/Registro'));
const {Actualizar_Producto} = require(path.join(__dirname,'./Productos/Actualizar/Actualizar'));

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

      //Carga el archivo HTML de nuestra aplicación
  
      mainWindow.loadFile(path.join(__dirname,'index.html'));

    	mainWindow.webContents.openDevTools();

      mainWindow.on('close', (event) => {

      });

}
/*------------------------------------------------------*/

DB.conectar("UnoStock.db").then(db => {

(async () => { 
 await DB.conectar();
 // Listar tablas
        const tablas = await DB.listarTablas();
        console.log('Tablas en la base de datos:', tablas);


  //******//
        const productos = await DB.leer('SELECT * FROM productos');
        await console.log('Productos:', productos);
  //******//
 
 await DB.cerrar();
})();


    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });


/*------------------------------------------------------*/
/****Manejo de productos*****/
ipcMain.on('Buscar-input-text-producto', (event) => {

  console.log('Buscar-input-text-producto')

})

ipcMain.on('Buscar-categoria-producto', (event) => {

  console.log('Buscar-categoria-producto')

})


ipcMain.on('open-registro-producto', (event) => {

  //console.log("abriendo registro")

       // Registro_Producto()

      (async () => { 
       await DB.conectar();
        /*-----------*/
        const nuevoId = await DB.crear('INSERT INTO productos (nombre, categoria, stock, precio_usd) VALUES ( ?, ?, ?, ?)', ["Arros","granos",20,7.00]);
        await console.log('Producto insertado con ID:', nuevoId);
        /*---------------*/
       await DB.cerrar();
      })();

})


ipcMain.on('open-Actualizar-producto', (event) => {


  console.log("abriendo actualizar")
  Actualizar_Producto()

})

ipcMain.on('open-Info-producto', (event) => {


  console.log("abriendo Informacion producto")
  Info_Producto()


})

ipcMain.on('open-retiro-producto', (event) => {


  console.log("abriendo retiro")



})

ipcMain.on('open-Borrar-producto', (event) => {


console.log("abriendo retiro")


})

/****Manejo de productos*****/
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



/*******

insert into `wp_users`(`ID`, `user_login`, `user_pass`, `user_nicename`, `user_email`, `user_url`, `user_registered`, `user_activation_key`, `user_status`, `display_name`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9],[value-10])


*********/