/*Variables de librerias library varial***/
const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path')
const fs = require('fs')
const os_system = require('os')
const { v4: uuidv4 } = require('uuid');

/*--------------LINK BASE DE DATOS ------------------------*/
const UnoStockDB = require(path.join(__dirname,'./BD/UnoStockManager.js'))
let DB_Path = path.join(__dirname,'./BD/UnoStock.db');
const DB = new UnoStockDB(DB_Path);
const generarProductos = require(path.join(__dirname,'./BD/generarProductos.js'))

/*-------------LINK BASE DE DATOS -------------------------*/
/*---------------LINK A FUNCIONES DE ARCHIVOS Y VENTANAS-----------------------------------*/
const {Info_Producto} = require(path.join(__dirname,'./Productos/Informacion/Informacion'));
const {Registro_Producto} = require(path.join(__dirname,'./Productos/Registro/Registro'));
const {Retiro_Producto} = require(path.join(__dirname,'./Productos/Retiro/Retiro'));
const {Actualizar_Producto} = require(path.join(__dirname,'./Productos/Actualizar/Actualizar'));
const {Nueva_Categoria} = require(path.join(__dirname,'./Productos/NuevaCategoria/NuevaCategoria'));
const {caja_control} = require(path.join(__dirname,'./caja_control/caja_control'));

let  mainWindow;

function App(){

      mainWindow = new BrowserWindow({
        width: 1030,
        height: 630,
        icon:path.join(__dirname,'/favicon.ico'),
          webPreferences:{
            nodeIntegration: false, // Deshabilita la integración de Node.js para contenido remoto
            contextIsolation: true, // Aísla el contenido del proceso principal
            preload:path.join(__dirname,'/preload.js') // Archivo de "preload" que carga antes del contenido remoto
          }
      })

      //Carga el archivo HTML de nuestra aplicación
  
    mainWindow.loadFile(path.join(__dirname,'index.html'));

    mainWindow.webContents.openDevTools();



   //caja_control("Apertura",mainWindow)

    //mainWindow.on('close',(event) => {
        
       //caja_control("Cierre",mainWindow)
        
        //event.preventDefault();
        
    //});




}
/*-------------------------------------------------------------
fs.watch(DB_Path, (eventType, filename) => {

    (async () => {
       await DB.conectar();

              const productos = await DB.leer('SELECT * FROM productos');
              await mainWindow.send('productos-data',productos)
        
            const categoria_list = await DB.leer('SELECT * FROM categoria');
            await mainWindow.send("categoria-list-data-product",categoria_list)
          
        await DB.cerrar();
    })();

});
*/


/*******CREA LA BASE DE DATOS SI NO ESTA Y SE CONECTA****************/
DB.conectar("UnoStock.db").then(async db => {

  console.log("Conectado a una Base de Datos")

      /*------------------------------*/
      const tablas = await DB.listarTablas();
      await console.log('Tablas en la base de datos:',tablas.length);
      /*------------------------------*/
      if(tablas.length==0){
        console.log("creando tablas...")
        await DB.conectar();

        await DB.crearTabla("CREATE TABLE IF NOT EXISTS productos (key INTEGER PRIMARY KEY AUTOINCREMENT, cod TEXT UNIQUE NOT NULL, cod_Empresa TEXT, nombre TEXT NOT NULL, precio REAL NOT NULL, iva REAL DEFAULT 0.00, descuento REAL DEFAULT 0.00, image TEXT, categoria TEXT, cant INTEGER NOT NULL DEFAULT 0, time_registro DATETIME DEFAULT CURRENT_TIMESTAMP )")
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS categoria (key INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT)")
        /*---------------------*/
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS proveedores (key INTEGER PRIMARY KEY AUTOINCREMENT, cod_Empresa TEXT NOT NULL UNIQUE, Nombre TEXT NOT NULL, Direccion TEXT, correo TEXT UNIQUE, Telefono TEXT, Descripcion TEXT )") 
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS usuarios (key INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, email TEXT UNIQUE, edad INTEGER )")
      
        /*--------------------*/
        await DB.crearTabla('CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, ci TEXT UNIQUE, telefono TEXT )')
        await DB.crearTabla('CREATE TABLE IF NOT EXISTS ventas (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente TEXT NOT NULL, ci TEXT, telefono TEXT, fecha TEXT NOT NULL )')
        await DB.crearTabla('CREATE TABLE IF NOT EXISTS detalle_venta (id INTEGER PRIMARY KEY AUTOINCREMENT, venta_id INTEGER, cod TEXT, producto TEXT, cantidad INTEGER, precio REAL, descuento REAL, total REAL, FOREIGN KEY (venta_id) REFERENCES ventas(id) )')
        await DB.crearTabla('CREATE TABLE IF NOT EXISTS movimientos (id INTEGER PRIMARY KEY AUTOINCREMENT, tipo TEXT, descripcion TEXT, fecha TEXT )')
        /*--------------------*/
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS Historial_de_caja (key INTEGER PRIMARY KEY AUTOINCREMENT, estado TEXT, fecha TEXT, dinero NUMERIC)")
        await DB.crearTabla("CREATE TABLE IF NOT EXISTS Dinero_Almacenado (key INTEGER PRIMARY KEY AUTOINCREMENT,  dinero  NUMERIC, fecha TEXT)")
        /*-----------------------------------------*/
        const fechaActual = new Date();
        await DB.crear('INSERT INTO Historial_de_caja (estado,dinero,fecha) VALUES (?,?,?)', ["Registro",0,fechaActual] );
        await DB.crear('INSERT INTO Dinero_Almacenado (dinero,fecha) VALUES (?,?)', [0,fechaActual] );
        /*-------------------------------------------*/

        await DB.cerrar();

            generarProductos()/**Agregar Productos de Pruebas**/

      }

}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});

/*******CREA LA BASE DE DATOS SI NO ESTA Y SE CONECTA****************/
/*---------------------------------------------------------------*/
/**********MANEJO DE INFORMACION AL DASBOARD**************/
/*---------------------------------------------------------------*/

ipcMain.on('get-informacion-dasboard',(event) => {


    (async () => {
    await DB.conectar();

      let sql1 = 'SELECT COUNT(*) AS total_general_productos, SUM(CASE WHEN cant <= 5 THEN 1 ELSE 0 END) AS total_productos_stock_bajo, SUM(precio) AS valor_total_todos_productos FROM productos'
      let sql2 = 'SELECT nombre, precio, cant, categoria FROM productos WHERE cant <= 5 ORDER BY nombre'
      let sql3 = "SELECT SUM(CASE WHEN DATE(fecha) = DATE('now') THEN 1 ELSE 0 END) AS movimientos_hoy, SUM(CASE WHEN DATE(fecha) = DATE('now','-1 day') THEN 1 ELSE 0 END) AS movimientos_ayer FROM movimientos"
      let sql4 = 'SELECT * FROM movimientos'
      let sql5 = 'SELECT * FROM proveedores'
      
      const productos_dasboard_total = await DB.leer(sql1);
      //await console.log(productos_dasboard_total)
      await mainWindow.send('productos-data-total-productos',productos_dasboard_total)
      /*----------------------------*/
      const productos_dasboard_list_product = await DB.leer(sql2);
      //await console.log(productos_dasboard_list_product)
      await mainWindow.send('productos-data-list-productos',productos_dasboard_list_product)
      /*----------------------------*/
      const movimiento_dasboard_activity = await DB.leer(sql3);
      //await console.log(movimiento_dasboard_activity)
      await mainWindow.send('movimientos-data-actividad',movimiento_dasboard_activity)

      const movimiento_dasboard_list = await DB.leer(sql4);
      //await console.log(movimiento_dasboard_list)
      await mainWindow.send('movimientos-data-list',movimiento_dasboard_list)
      //
      const proveedores = await DB.leer('SELECT * FROM proveedores');
       mainWindow.send('proveedores-data-list', proveedores);
        
    //await DB.cerrar();

    })();

})

/*---------------------------------------------------------------*/
/**********MANEJO DE INFORMACION AL DASBOARD**************/
/*---------------------------------------------------------------*/

/*---------------------------------------------------------------*/
/*---------------FUNCIONES DDE MANEJO DE PRODUCTOS------------------------------*/
/*---------------------------------------------------------------*/
ipcMain.on('Refrescar-data-area-producto', (event) => {

      (async () => { 
       await DB.conectar();

            const productos = await DB.leer('SELECT * FROM productos');
            await mainWindow.send('productos-data',productos)
        
            const categoria_list = await DB.leer('SELECT * FROM categoria');
            await mainWindow.send("categoria-list-data-product",categoria_list)

       await DB.cerrar();
      })();

})

/****Manejo de productos*****/
ipcMain.on('solicitud-data-productos', (event) => {

    (async () => {
        await DB.conectar();
        /*------------------------------*/
          const productos = await DB.leer('SELECT * FROM productos')

          await mainWindow.send('productos-data',productos)
        /*------------------------------*/
          const categoria_list = await DB.leer('SELECT * FROM categoria');
           await mainWindow.send("categoria-list-data-product",categoria_list)

        /*------------------------------*/
        await DB.cerrar();
    })();

})


ipcMain.on('Buscar-input-text-producto', (event,valor) => {

    if(!isNaN(valor)){
          
            (async () => { 
               await DB.conectar();

                const product = await DB.buscar('SELECT * FROM productos WHERE cod = ?', [valor]);
                await console.log('Producto select con cod:',product);
                
                await mainWindow.send("productos-data",[product])
               await DB.cerrar();
            })();

    } 
    else{

              (async () => { 
                 await DB.conectar();

                  const product = await DB.buscar('SELECT * FROM productos WHERE nombre = ?', [valor]);
                  await console.log('Producto select con nombre:',product);
                  
                    await mainWindow.send("productos-data",[product])
                 await DB.cerrar();
              })();

    }

})

ipcMain.on('Buscar-categoria-producto', (event,valor) => {

  console.log('Buscar-categoria-producto', valor);

        (async () => { 
           await DB.conectar();

            const producto = await DB.leer('SELECT * FROM productos WHERE categoria = ?',[valor]);
            await console.log('categoria-producto',producto);
            
              await mainWindow.send("productos-data",producto)
           await DB.cerrar();
        })();

})


ipcMain.on('open-registro-producto', (event) => {

       //console.log("abriendo registro")
       Registro_Producto()
})

ipcMain.on('open-Actualizar-producto', (event,code) => {

  console.log("abriendo actualizar",code)
  Actualizar_Producto(code)

})

ipcMain.on('open-Info-producto', (event,code) => {

  console.log("abriendo Informacion producto",code)
  Info_Producto(code)


})

ipcMain.on('open-Borrar-producto', (event,code) => {

     (async () => {
     await DB.conectar();
      /*------------------------------*/
        const filasBorradas = await DB.borrar('DELETE FROM productos WHERE cod = ?', [code]);
        await console.log('Filas borradas:', filasBorradas);
      /*------------------------------*/
     //await DB.cerrar();
      })();

})

ipcMain.on("open-add-category", (event) => {

  Nueva_Categoria()

})

ipcMain.on('open-retiro-producto', (event) => {

  Retiro_Producto()

})

/*---------------------------------------------------------------*/
/*---------------FUNCIONES DE MANEJO DE PRODUCTOS------------------------------*/
/*---------------------------------------------------------------*/
/*************************************************************/
/*---------------------------------------------------------------*/
/*---------------FUNCIONES DE MANEJO DE MOVIMIENTOS------------------------------*/
/*---------------------------------------------------------------*/

ipcMain.on("obtener-datos-area-movimientos",(event) => {

    (async () => {
       await DB.conectar();

            const Movimientos = await DB.leer('SELECT * FROM movimientos');
            await mainWindow.send("Informacion-de-datos-movimientos",Movimientos)
            /*-----*/
            const detalle_venta = await DB.leer('SELECT * FROM detalle_venta');
            await mainWindow.send("Informacion-de-datos-detalle_venta",detalle_venta)
            /*-*/
            const producto_data_activity = await DB.leer('SELECT COUNT(*) AS total_general_productos, SUM(CASE WHEN cant <= 5 THEN 1 ELSE 0 END) AS total_productos_stock_bajo, SUM(precio) AS valor_total_todos_productos FROM productos');
            await mainWindow.send("Informacion-de-datos-movimientos-productos",producto_data_activity)
          
        await DB.cerrar();
    })();

})

// Consultar productos agrupados por categoría
ipcMain.on('getProductos',() => {
  (async () => {
      await DB.conectar();
      const info = await DB.leer(`SELECT categoria, COUNT(*) as cantidad FROM productos GROUP BY categoria`)
      await mainWindow.send("Grafico-productos",info)
      
    })();
});

// Consultar movimientos por día

ipcMain.on('getMovimientos',() => {

  (async () => {
      await DB.conectar();
   const info = await DB.leer(`SELECT DATE(fecha) as dia, COUNT(*) as cantidad FROM movimientos GROUP BY DATE(fecha) ORDER BY dia`)
      await mainWindow.send("Grafico-Movimientos",info)
   
    })();
});

ipcMain.on('getcantidad',() => {

  (async () => {
      await DB.conectar();
   const info = await DB.leer(`SELECT producto, SUM(total) AS ingresos FROM detalle_venta GROUP BY producto ORDER BY ingresos DESC`)
      await mainWindow.send("Grafico-cantidad",info)
   
    })();
});

ipcMain.on('getingresos',() => {

  (async () => {
      
      await DB.conectar();
   const info = await DB.leer(`SELECT producto, SUM(total) AS ingresos FROM detalle_venta GROUP BY producto ORDER BY ingresos DESC; `)
    await mainWindow.send("Grafico-ingresos",info)
   
    })();
});

/*---------------------------------------------------------------*/
/*---------------FUNCIONES DE MANEJO DE MOVIMIENTOS------------------------------*/
/*---------------------------------------------------------------*/

/*

CREATE TABLE "detalle_venta" (
  "id"  INTEGER,
  "venta_id"  INTEGER,
  "cod" TEXT,
  "producto"  TEXT,
  "cantidad"  INTEGER,
  "precio"  REAL,
  "descuento" REAL,
  "total" REAL,
  PRIMARY KEY("id" AUTOINCREMENT),
  FOREIGN KEY("venta_id") REFERENCES "ventas"("id")
);


CREATE TABLE "movimientos" (
  "id"  INTEGER,
  "tipo"  TEXT,
  "descripcion" TEXT,
  "fecha" TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
);

*/
/*------------------------------------------------------*/
/*  MANEJO DE PROVEEDORES  */
/*------------------------------------------------------*/
/*0. PROVEEDORES EN EL DASHBOARD */
ipcMain.on('solicitar-proveedores-recientes', async (event) => {
    try {
        await DB.conectar();
        
        // Consulta: Obtener los 5 proveedores más recientes 
        const query = 'SELECT cod_Empresa, Nombre, Direccion, Telefono, correo, Descripcion FROM proveedores ORDER BY key DESC LIMIT 5';
        const proveedoresRecientes = await DB.leer(query);
        
        await DB.cerrar();
        
        // Canal de respuesta: 'proveedores-recientes-cargados'
        event.reply('proveedores-recientes-cargados', proveedoresRecientes);

    } catch (error) {
        console.error("Error al obtener proveedores recientes para el dashboard:", error);
        await DB.cerrar();

        event.reply('proveedores-recientes-error', 'Fallo al leer la base de datos para proveedores recientes.');
    }
});

// 1. OBTENER TODOS LOS PROVEEDORES
ipcMain.on('solicitud-data-proveedores', (event) => {

    (async () => {
    await DB.conectar();
        const proveedores = await DB.leer('SELECT * FROM proveedores');
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.send('proveedores-data', proveedores);
        }
    await DB.cerrar();
    })();

});

// 2. BUSCAR PROVEEDORES
ipcMain.on('Buscar-input-text-proveedor', (event, valor) => {

    (async () => { 
        await DB.conectar();
        
        const query = `SELECT * FROM proveedores WHERE Nombre LIKE ? OR cod_Empresa LIKE ? OR Telefono LIKE ?`;
        const searchVal = `%${valor}%`;
        const proveedores = await DB.leer(query, [searchVal, searchVal, searchVal]); 
        
        if (mainWindow && !mainWindow.isDestroyed()) {
          await mainWindow.send("proveedores-data", proveedores);
        }
        await DB.cerrar();
    })();

});

//buscar-proveedor

// 3. GUARDAR NUEVO PROVEEDOR 
ipcMain.on('Guardar-proveedor', async (event, data) => {

    try {
        await DB.conectar();
        
        const sql = 'INSERT INTO proveedores (cod_Empresa, Nombre, Direccion, Telefono, correo, Descripcion) VALUES (?, ?, ?, ?, ?, ?)';
        const cod_Empresa = uuidv4(); 
        
        await DB.crear(sql, [data.Riff, data.Nombre, data.Direccion, data.Telefono, data.correo, data.Descripcion]);
        
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.send('proveedor-operacion-completa');
        }
        await DB.cerrar();
    } catch (error) {
        console.error('Error al guardar proveedor:', error);
        
        if (error.code === 'SQLITE_CONSTRAINT') {
            let mensaje = "Error de la Base de Datos: El correo electrónico ya existe o falta un campo obligatorio.";

            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.send('proveedor-operacion-error', mensaje);
            }
        }
    }
});

// 4. OBTENER PROVEEDOR POR ID 
ipcMain.on('solicitud-proveedor-by-id', async (event, id) => {
    try {
        await DB.conectar();
        const proveedor = await DB.buscar('SELECT * FROM proveedores WHERE key = ?', [id]);
        
        event.sender.send('proveedor-data-to-edit', proveedor); 
        await DB.cerrar();
    } catch (error) {
        console.error(`Error al buscar proveedor ID ${id}:`, error);
        event.sender.send('proveedor-data-to-edit', null);
    }
});


// 5. ACTUALIZAR PROVEEDOR
ipcMain.on('Actualizar-proveedor',(event, data) => {
  //console.log('Actualizar-proveedor',data)

(async () => { 
          await DB.conectar();
                      
          const sql = 'UPDATE proveedores SET cod_Empresa=?, Nombre=?, Direccion=?, Telefono=?, correo=?, Descripcion=? WHERE key = ?';
         const proveedor = await DB.actualizar(sql,[data.Riff, data.Nombre, data.Direccion, data.Telefono, data.correo, data.Descripcion, data.key]);
     await console.log('Actualizar-proveedor',proveedor) 
      await mainWindow.send('proveedor-operacion-completa');       

          await DB.cerrar();
})();


});

// 6. BORRAR PROVEEDOR 
ipcMain.on('open-Borrar-proveedor', (event, id) => {

    (async () => {
        try {
            await DB.conectar();
            
            const filasBorradas = await DB.borrar('DELETE FROM proveedores WHERE key = ?', [id]);
            await console.log(`Proveedor con ID ${id} borrado. Filas:`, filasBorradas);
            
            //Envía la señal de operación completada para que el frontend fuerce el foco
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.send('proveedor-operacion-completa');
            }
            await DB.cerrar();
        } catch (error) {
            console.error(`Error al intentar borrar proveedor ${id}:`, error);
        }
    })();

});

/*------------------------------------------------------*/
/* FIN DE MANEJO DE PROVEEDORES */
/*------------------------------------------------------*/

/*------------------------------------------------------*/
/*-MANEJO DE FUNCIONES DE CIERRE DEL MAIN-*
/*------------------------------------------------------*/
ipcMain.on('app_version', (event) => {

    mainWindow.send('app_version', { name:app.getName(), version: app.getVersion() });

});



ipcMain.on("quit-app",(event,arg) => { 

    console.log("Quit App")

setTimeout(() => {
      // ⚠️ Importante: Desconecta el listener antes de cerrar para evitar un bucle infinito
      mainWindow.removeAllListeners('close');

      mainWindow.destroy();
      
    },3 * 1000); // Convierte segundos a milisegundos

});

ipcMain.on('reset-app',(event,arg) => { 

	console.log("RESET APP");
    app.relaunch();
    app.quit();

});



  /*--------------------------------*/
// Evento cuando la app está lista para crear ventanas
app.on('ready', App,  Menu.setApplicationMenu(null) );

// Evento cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Evento cuando la app se activa (solo en macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
       App();
    }
});



/*******

insert into `wp_users`(`ID`, `user_login`, `user_pass`, `user_nicename`, `user_email`, `user_url`, `user_registered`, `user_activation_key`, `user_status`, `display_name`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9],[value-10])


*********/