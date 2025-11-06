const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

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

module.exports = {
   Registro_Producto:Registro_Producto,
};
