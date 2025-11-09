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


let Info_Producto_Window;
let id_product;
function Info_Producto(id){

                Info_Producto_Window = new BrowserWindow({
                        width:740,
                        height:340,
                        maxWidth:740,   
                        maxHeight:340, 
                          resizable:false,
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })

                id_product=id


                console.log('Info_Producto',id)

                Info_Producto_Window.loadFile("app/Productos/Informacion/Informacion.html")      
            
               // Info_Producto_Window.webContents.openDevTools()
                                
                Info_Producto_Window.once('ready-to-show', () => {
                                  
                    Info_Producto_Window.show()    
                })

      
}

/*---------------------------------------------------------------------------*/


ipcMain.on("get-Informacion-productos",(event, arg) => {

    (async () => { 
       await DB.conectar();

        const data_product = await DB.buscar('SELECT * FROM productos WHERE cod = ?', [id_product]);
        await console.log('Producto select con ID:',data_product);
        
    await Info_Producto_Window.webContents.send("Informacion-productos",data_product)
       await DB.cerrar();
    })();

})
//



/*---------------------------------------------------------------------------*/

module.exports = {
   Info_Producto:Info_Producto,
};
