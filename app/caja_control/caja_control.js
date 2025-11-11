const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

/*----------------------------------------------------*/
const UnoStockDB = require(path.join(__dirname,'../BD/UnoStockManager.js'))
let DB_Path = path.join(__dirname,'../BD/UnoStock.db');
const DB = new UnoStockDB(DB_Path);
/*---------------------------------------------------------------*/
let valor_de_dinero_de_caja;

let caja_control_Window;
let id_product;
function caja_control(mainWindow){

                caja_control_Window = new BrowserWindow({
                     /*parent:mainWindow,*/
                     modal:true,
                        width:400,
                        height:180,  
                        resizable:false,
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../preload.js')
                        }

                })

                caja_control_Window.loadFile("app/caja_control/caja_control.html")      
            
               caja_control_Window.webContents.openDevTools()
                                
                caja_control_Window.once('ready-to-show', () => {
                                  
                    caja_control_Window.show()    
                })

      
}

/*
ipcMain.on("Nuevo-monto-caja",(event,monto)=>{

valor_de_dinero_de_caja=monto

})*/

ipcMain.on("solicitud-status-caja",(event,status)=>{
 
      (async () => { 
       await DB.conectar();
        const info = await DB.leer('SELECT * FROM CajaDinero ORDER BY key DESC LIMIT 1');
      await caja_control_Window.webContents.send("status-caja-dinero",info)
       await DB.cerrar();
      })();

  

})
/*---------------------------------------------------------------------------*/

ipcMain.on("guardar-status-caja",(event,status)=>{

      (async () => { 
       await DB.conectar();

        const nuevoId = await DB.crear('INSERT INTO CajaDinero (estado,dinero,fecha) VALUES (?,?,?)',[status.estado,status.dinero,status.fecha]);
   
       await DB.cerrar();
      })();

})


ipcMain.on("guardar-status-caja-cierre",(event,status)=>{

      (async () => { 
       await DB.conectar();

        const nuevoId = await DB.crear('INSERT INTO CajaDinero (estado,dinero,fecha) VALUES (?,?,?)',[status.estado,valor_de_dinero_de_caja,status.fecha]);
   
       await DB.cerrar();
      })();

})

/*---------------------------------------------------------------------------*/

module.exports = {
   caja_control:caja_control,
};
