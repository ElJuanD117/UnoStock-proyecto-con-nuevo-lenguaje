const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

/*----------------------------------------------------*/
const UnoStockDB = require(path.join(__dirname,'../../BD/UnoStockManager.js'))
let DB_Path = path.join(__dirname,'../../BD/UnoStock.db');
const DB = new UnoStockDB(DB_Path);
/*---------------------------------------------------------------*/


let Retiro_Producto_Window;


function Retiro_Producto(){

                Retiro_Producto_Window = new BrowserWindow({
                        width:740,
                        height:420,
                        resizable:true,   
                        frame: true,
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })

                Retiro_Producto_Window.loadFile("app/Productos/Retiro/Retiro.html")
            
               Retiro_Producto_Window.webContents.openDevTools()
                                
                Retiro_Producto_Window.once('ready-to-show', () => {
                                  
                    Retiro_Producto_Window.show()    
                })

   
}

/*---------------------------*/

ipcMain.on("Buscar-producto-retiro", (event,valor) => {

    console.log("Buscar-producto-retiro",valor)

    if(!isNaN(valor)){
          
            (async () => { 
               await DB.conectar();

                const product = await DB.buscar('SELECT * FROM productos WHERE cod = ?', [valor]);
                await console.log('Producto select con cod:',product);
                
                await Retiro_Producto_Window.send("productos-data-retiro",[product])
               await DB.cerrar();
            })();

    } 
    else{

              (async () => { 
                 await DB.conectar();

                  const product = await DB.buscar('SELECT * FROM productos WHERE nombre = ?', [valor]);
                  await console.log('Producto select con nombre:',product);
                  
                    await Retiro_Producto_Window.send("productos-data-retiro",[product])
                 await DB.cerrar();
              })();

    }

})



/*--------------------------*/
module.exports = {
   Retiro_Producto:Retiro_Producto,
};
