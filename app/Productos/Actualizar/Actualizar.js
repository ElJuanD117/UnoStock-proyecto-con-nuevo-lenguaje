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

let Actualizar_Producto_Window;
let code_producto;
function Actualizar_Producto(code_product){

                Actualizar_Producto_Window = new BrowserWindow({
                       width:720,
                        height:360,
                       /* maxWidth:720,   
                        maxHeight:320, */
                         resizable:false,
                        frame: false,
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })

                Actualizar_Producto_Window.loadFile("app/Productos/Actualizar/Actualizar.html")
            
             //Actualizar_Producto_Window.webContents.openDevTools()
                                
             Actualizar_Producto_Window.once('ready-to-show', () => {
                                  
                    Actualizar_Producto_Window.show()    
                })

           code_producto = code_product
      
}
/************************************/
ipcMain.on("get-Informacion-producto-actualizar",(event, arg) => {

   /*------------------------------*/
    (async () => { 
        await DB.conectar();

        const data_producto = await DB.buscar('SELECT * FROM productos WHERE cod = ?', [code_producto]);
        await Actualizar_Producto_Window.webContents.send("Informacion-producto-actualizar",data_producto)
        /*------------------------------------*/
        const categoria_list = await DB.leer('SELECT * FROM categoria');
        await Actualizar_Producto_Window.webContents.send("Informacion-obtenida-categoria-lista-actualizar-producto",categoria_list)  

        await DB.cerrar();
    })();
   /*-------------------------------------*/

})

/************************************/
ipcMain.on('Select_image_product_update',(event,arg) => {

        var  options = {  

            title:'Select Image Product',
            buttonLabel:'Select Image', 
            filters: [ { name: 'Images', extensions:  ['jpg', 'png', 'gif', "jpeg", "gif"] } ],             
            properties:['openFile','showHiddenFiles','promptToCreate']              

        }

        dialog.showOpenDialog(null,options).then(result => {

                let Addres_image_select = result.filePaths.toString();

                /***DIRECCION DE ACCESO DESDE EL SERVIDOR*/

                Actualizar_Producto_Window.webContents.send("get-select-image-product_update",Addres_image_select);

                /*****MOSTRAR IMAGEN SELECCIONADA*/     
                         
        });

});


ipcMain.on('save_update_product',(event,data_producto) => {  

      (async () => { 
       await DB.conectar();

        const nuevoId = await DB.actualizar('UPDATE productos SET cod = ?, cod_Empresa = ?, nombre = ?, precio = ?, iva = ?, descuento = ?, image = ?, categoria = ?, cant = ?, time_registro = ? WHERE cod = ?',[ data_producto.code, data_producto.riff_Supplier, data_producto.name, data_producto.price, data_producto.iva_product, data_producto.discount_Product_price, data_producto.image, data_producto.category, data_producto.amount, data_producto.Registration_Time,code_producto]);
        //await console.log('Producto insertado con ID:', nuevoId);
       await DB.cerrar();
      })();


})
/*
/************************************/

module.exports = {
   Actualizar_Producto:Actualizar_Producto,
};
