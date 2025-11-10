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


let Nueva_Categoria_Window;
let id_product;
function Nueva_Categoria(id){

                Nueva_Categoria_Window = new BrowserWindow({
                        width:400,
                        height:400,  
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


               // console.log('Nueva_Categoria',id)

                Nueva_Categoria_Window.loadFile("app/Productos/NuevaCategoria/NuevaCategoria.html")      
            
               //Nueva_Categoria_Window.webContents.openDevTools()
                                
                Nueva_Categoria_Window.once('ready-to-show', () => {
                                  
                    Nueva_Categoria_Window.show()    
                })

      
}

/*---------------------------------------------------------------------------*/

ipcMain.on("Informacion-categoria-lista",(event, arg) => {

    (async () => { 
       await DB.conectar();
        const categoria_list = await DB.leer('SELECT * FROM categoria');
        await Nueva_Categoria_Window.webContents.send("Informacion-obtenida-categoria-lista",categoria_list)
       await DB.cerrar();
    })();

})

ipcMain.on("guardar-nueva-categoria",(event,nuevo) => {

    (async () => { 
        await DB.conectar();
        const data = await DB.crear('INSERT INTO categoria (nombre) VALUES (?)',[nuevo]);
        await console.log('nueva categoria:',data);
        /*------------------------------*/
        const categoria_list = await DB.leer('SELECT * FROM categoria');    
        await Nueva_Categoria_Window.webContents.send("Informacion-obtenida-categoria-lista",categoria_list)
        await DB.cerrar();
    })();

})

ipcMain.on("borrar-categoria",(event,key) => {

(async () => {
    await DB.conectar();
    /*------------------------------*/
    const filasBorradas = await DB.borrar('DELETE FROM categoria WHERE key = ?', [key]);
    await console.log('Filas borradas:', filasBorradas);
    /*------------------------------*/
    const categoria_list = await DB.leer('SELECT * FROM categoria');    
    await Nueva_Categoria_Window.webContents.send("Informacion-obtenida-categoria-lista",categoria_list)
    await DB.cerrar();
})();


})



/*---------------------------------------------------------------------------*/

module.exports = {
   Nueva_Categoria:Nueva_Categoria,
};
