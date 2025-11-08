const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

let Actualizar_Producto_Window;

function Actualizar_Producto(Action){

                Actualizar_Producto_Window = new BrowserWindow({
                        width:720,
                        height:426,
                        maxWidth:720,   
                        maxHeight:426, 
                        resizable:true, 
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })

                Actualizar_Producto_Window.loadFile("app/Productos/Actualizar/Actualizar.html")
            
                Actualizar_Producto_Window.webContents.openDevTools()
                                
                Actualizar_Producto_Window.once('ready-to-show', () => {
                                  
                    Actualizar_Producto_Window.show()    
                })


console.log("Action",Action)
      
}

module.exports = {
   Actualizar_Producto:Actualizar_Producto,
};
