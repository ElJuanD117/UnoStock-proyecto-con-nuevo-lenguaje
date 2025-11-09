/*Variables de librerias library varial***/
const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

/*--------------------------------------*/
const UnoStockDB = require(path.join(__dirname,'./BD/UnoStockManager.js'))
let DB_Path = path.join(__dirname,'./BD/UnoStock.db');
//console.log(DB_Path)
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
/*----------------------------------------------------------*/
fs.watch(DB_Path, (eventType, filename) => {

    (async () => {
       await DB.conectar();
        /*------------------------------*/
          const productos = await DB.leer('SELECT * FROM productos');
          //await console.log('Productos:',productos);
          await mainWindow.send('productos-data',productos)
        /*------------------------------*/
       await DB.cerrar();
    })();

});
/*------------------------------------------------------*/
/*******CREA LA BASE DE DATOS SI NO ESTA Y SE CONECTA****************/
DB.conectar("UnoStock.db").then(async db => {

  console.log("Conectado a una Base de Datos")

      /*------------------------------*/
      const tablas = await DB.listarTablas();
      await console.log('Tablas en la base de datos:',tablas.length);
      /*------------------------------*/
      if(tablas.length==0){
        console.log("creando tablas...")
        await DB.conectar();

        await DB.crearTabla("CREATE TABLE IF NOT EXISTS productos (key INTEGER PRIMARY KEY AUTOINCREMENT, cod TEXT UNIQUE NOT NULL, cod_Empresa TEXT, nombre TEXT NOT NULL, precio REAL NOT NULL, iva REAL DEFAULT 0.00, descuento REAL DEFAULT 0.00, image TEXT, categoria TEXT, cant INTEGER NOT NULL DEFAULT 0, time_registro DATETIME DEFAULT CURRENT_TIMESTAMP )")
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS usuarios (key INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, email TEXT UNIQUE, edad INTEGER )")
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS proveedores (key INTEGER PRIMARY KEY AUTOINCREMENT, cod_Empresa TEXT NOT NULL UNIQUE, Nombre TEXT NOT NULL, Direccion TEXT, correo TEXT UNIQUE, Telefono TEXT )") 
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS detalle_venta (id_detalle INTEGER PRIMARY KEY AUTOINCREMENT, id_venta INTEGER, id_producto INTEGER, cantidad INTEGER NOT NULL, precio_venta_usd REAL NOT NULL, FOREIGN KEY(id_venta) REFERENCES ventas(id_venta), FOREIGN KEY(id_producto) REFERENCES productos(id_producto) )") 
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS movimientos_stock (id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT, id_producto INTEGER NOT NULL, tipo_movimiento TEXT NOT NULL, cantidad INTEGER NOT NULL, costo_unidad_usd REAL, fecha_hora TEXT NOT NULL, FOREIGN KEY(id_producto) REFERENCES productos(id_producto) )")
        await DB.crearTabla("CREATE TABLE ventas (id_venta INTEGER PRIMARY KEY AUTOINCREMENT, fecha_hora TEXT NOT NULL, total_usd REAL NOT NULL, total_ves REAL NOT NULL )")

        await DB.cerrar();
      }



})
.catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});


/*------------------------------------------------------*/
/****Manejo de productos*****/
ipcMain.on('solicitud-data-productos', (event) => {

     (async () => {
     await DB.conectar();
      /*------------------------------*/
        const productos = await DB.leer('SELECT * FROM productos');
        //await console.log('Productos:',productos);
        mainWindow.send('productos-data',productos)
      /*------------------------------*/
       await DB.cerrar();
      })();

})


ipcMain.on('Buscar-input-text-producto', (event,valor) => {


if(!isNaN(valor)){

      
       (async () => { 
       await DB.conectar();

        const product = await DB.buscar('SELECT * FROM productos WHERE cod = ?', [valor]);
        await console.log('Producto select con cod:',product);
        
        await mainWindow.send("productos-data",[product])
       await DB.cerrar();
    })();

      } 
      else{

            (async () => { 
       await DB.conectar();

        const product = await DB.buscar('SELECT * FROM productos WHERE nombre = ?', [valor]);
        await console.log('Producto select con nombre:',product);
        
          await mainWindow.send("productos-data",[product])
       await DB.cerrar();
    })();

      }
})

ipcMain.on('Buscar-categoria-producto', (event) => {

  console.log('Buscar-categoria-producto')

})


ipcMain.on('open-registro-producto', (event) => {

  //console.log("abriendo registro")
       Registro_Producto()
})


ipcMain.on('open-Actualizar-producto', (event,code) => {


  console.log("abriendo actualizar",code)
  Actualizar_Producto(code)

})

ipcMain.on('open-Info-producto', (event,code) => {


  console.log("abriendo Informacion producto",code)
  Info_Producto(code)


})

ipcMain.on('open-Borrar-producto', (event,code) => {

     (async () => {
     await DB.conectar();
      /*------------------------------*/
        const filasBorradas = await DB.borrar('DELETE FROM productos WHERE cod = ?', [code]);
        await console.log('Filas borradas:', filasBorradas);
      /*------------------------------*/
     //await DB.cerrar();
    })();

})

ipcMain.on('open-retiro-producto', (event) => {



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
/*
ipcMain.on('reset',(event,arg) => { 

	console.log("RESET APP");
    app.relaunch();
    app.quit();

});*/

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