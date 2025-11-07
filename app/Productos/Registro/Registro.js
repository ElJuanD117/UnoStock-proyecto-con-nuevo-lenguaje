const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

/*----------------------------------------------------*/
const UnoStockDB = require(path.join(__dirname,'../../BD/UnoStockManager.js'))
let DB_Path = path.join(__dirname,'../../BD/UnoStock.db');
//console.log("DBdesdeRegistre ",DB_Path)
const DB = new UnoStockDB(DB_Path);
/*---------------------------------------------------------------*/


let Registro_Producto_Window;


function Registro_Producto(Action){

                Registro_Producto_Window = new BrowserWindow({
                        width:630,
                        height:440,
                        maxWidth:630,     
                        maxHeight:440, 
                        resizable:true,   
                        frame: false, 
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })

                Registro_Producto_Window.loadFile("app/Productos/Registro/Registro.html")
            
                Registro_Producto_Window.webContents.openDevTools()
                                
                Registro_Producto_Window.once('ready-to-show', () => {
                                  
                    Registro_Producto_Window.show()    
                })


console.log("Action",Action)
      
}


/*
ipcMain.on('get_language_info_product',(event,arg) => {              
    Info_Product_Window.send("change_language_info_product",Setting_App_control.type_language)
});


*/

ipcMain.on('save_data_product',(event,data_producto) => {  
      
      console.log(data_producto)
/*
      (async () => { 
       await DB.conectar();

        const nuevoId = await DB.crear('INSERT INTO productos (nombre, categoria, stock, precio_usd) VALUES ( ?, ?, ?, ?)', ["Arros","granos",20,7.00]);
        await console.log('Producto insertado con ID:', nuevoId);
     
       await DB.cerrar();
      })();
*/
})

module.exports = {
   Registro_Producto:Registro_Producto,
};
