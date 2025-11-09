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


let Registro_Producto_Window;


function Registro_Producto(Action){

                Registro_Producto_Window = new BrowserWindow({
                        width:720,
                        height:320,
                        maxWidth:720,   
                        maxHeight:320, 
                        resizable:false,   
                        frame: false, 
                        webPreferences: {
                            nodeIntegration: false, // is default value after Electron v5
                            contextIsolation: true, // protect against prototype pollution
                            enableRemoteModule: false, // turn off remote
                            preload:path.join(__dirname,'../../preload.js')
                        }

                })

                Registro_Producto_Window.loadFile("app/Productos/Registro/Registro.html")
            
               // Registro_Producto_Window.webContents.openDevTools()
                                
                Registro_Producto_Window.once('ready-to-show', () => {
                                  
                    Registro_Producto_Window.show()    
                })

   
}


ipcMain.on('Select_image_product',(event,arg) => {              
    
        var  options = {  

                title:'Select Image Product',
                buttonLabel:'Select Image', 
                filters: [ { name: 'Images', extensions:  ['jpg', 'png', 'gif', "jpeg", "gif"] } ],             
                properties:['openFile','showHiddenFiles','promptToCreate']              

        }

        dialog.showOpenDialog(null,options).then(result => {

               
                let Addres_image_select = result.filePaths.toString();

                /***DIRECCION DE ACCESO DESDE EL SERVIDOR*/

                Registro_Producto_Window.webContents.send("get-select-image-product",Addres_image_select);

                /*****MOSTRAR IMAGEN SELECCIONADA*/     
                            
        });

});


ipcMain.on('save_data_product',(event,data_producto) => {  
      
     //console.log('save_data_product',data_producto)

      (async () => { 
       await DB.conectar();

        const nuevoId = await DB.crear('INSERT INTO productos (cod, cod_Empresa, nombre, precio, iva, descuento, image, categoria, cant, time_registro) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[ data_producto.code, data_producto.riff_Supplier, data_producto.name, data_producto.sale_price, data_producto.iva_product, data_producto.discount_Product_price, data_producto.image, data_producto.category, data_producto.amount, data_producto.Registration_Time]);
        //await console.log('Producto insertado con ID:', nuevoId);
     
       await DB.cerrar();
      })();

     
})
/*

    cod, cod_Empresa, nombre, precio, iva, descuento, image, categoria, cant, time_registro
*/

/**


data_producto.code
data_producto.riff_Supplier
data_producto.name
data_producto.sale_price
data_producto.iva_product
data_producto.discount_Product_price
data_producto.image
data_producto.category
data_producto.amount
data_producto.Registration_Time

[ data_producto.code, data_producto.riff_Supplier, data_producto.name, data_producto.sale_price, data_producto.iva_product, data_producto.discount_Product_price, data_producto.image, data_producto.category, data_producto.amount, data_producto.Registration_Time] /*------------------------*

data_producto.riff_Supplier
data_producto.name_Supplier
data_producto.addres_Supplier
data_producto.email_Supplier
data_producto.phone_Supplier

[data_producto.riff_Supplier, data_producto.name_Supplier, data_producto.addres_Supplier, data_producto.email_Supplier, data_producto.phone_Supplier]



**/


module.exports = {
   Registro_Producto:Registro_Producto,
};
