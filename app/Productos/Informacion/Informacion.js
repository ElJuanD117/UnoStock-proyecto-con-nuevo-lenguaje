const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

let Info_Producto_Window;
function Info_Producto(id){

                Info_Producto_Window = new BrowserWindow({
                        width:630,
                        height:400,
                        maxWidth:630,     
                        maxHeight:440, 
                        resizable:false,   
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })


                console.log(path.join(__dirname,'../../preload.js'))

                Info_Producto_Window.loadFile("app/Productos/Informacion/Informacion.html")      
            
                Info_Producto_Window.webContents.openDevTools()
                                
                Info_Producto_Window.once('ready-to-show', () => {
                                  
                    Info_Producto_Window.show()    
                })

      
}

module.exports = {
   Info_Producto:Info_Producto,
};
