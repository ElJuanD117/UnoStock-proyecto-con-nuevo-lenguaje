const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// --- Dependencias Locales ---
// Asegúrate de que UnoStockDB exista y maneje promesas para async/await
const UnoStockDB = require(path.join(__dirname, '../BD/UnoStockManager.js'));
const DB_Path = path.join(__dirname, '../BD/UnoStock.db');
const DB = new UnoStockDB(DB_Path);

// --- Variables Globales ---
// Debe ser global para que los handlers de ipcMain la usen
let caja_control_Window = null; 
let valor_de_dinero_de_caja;
let id_product;

// -----------------------------------------------------------------
// FUNCIÓN PRINCIPAL DE GESTIÓN DE VENTANA
// -----------------------------------------------------------------

/**
 * Abre la ventana de control de caja (apertura o cierre).
 * @param {string} status - "Apertura" o "Cierre".
 * @param {BrowserWindow} [mainWindow] - La ventana principal para establecer la modalidad.
 */
function caja_control(status,) {
    // Si la ventana ya existe y no ha sido destruida, solo la enfoca y sale.
    if (caja_control_Window && !caja_control_Window.isDestroyed()) {
        caja_control_Window.focus();
        return;
    }

    caja_control_Window = new BrowserWindow({
        modal: true,
        width: 400,
        height: 180,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, '../preload.js')
        }
    });

    caja_control_Window.loadFile("app/caja_control/caja_control.html");
    // Solo abre DevTools en entorno de desarrollo
     //caja_control_Window.webContents.openDevTools(); 
                      
    caja_control_Window.once('ready-to-show', () => {
        caja_control_Window.show();
        
        // Enviar la solicitud de datos después de que la ventana esté lista
        if (status === "Apertura") {
            caja_control_Window.webContents.send("solicitar-status-caja-dinero", "data-para-apertura");
        } else if (status === "Cierre") {
            caja_control_Window.webContents.send("solicitar-status-caja-dinero", "data-para-cierre");
        }
    });

    // Limpia la referencia global cuando la ventana se cierra
    caja_control_Window.on('closed', () => {
        caja_control_Window = null;
    });
}


// -----------------------------------------------------------------
// FUNCIONES REUTILIZABLES DE DB
// -----------------------------------------------------------------

/**
 * Función genérica para obtener el último registro de una tabla.
 * @param {string} query - Consulta SQL para leer datos.
 * @param {string} sendChannel - Canal IPC para enviar el resultado.
 */
async function getLatestData(query, sendChannel) {
    if (!caja_control_Window || caja_control_Window.isDestroyed()) {
        console.warn("Ventana de control de caja no disponible para enviar datos.");
        return;
    }
    
    let info = [];
    try {
        await DB.conectar();
        info = await DB.leer(query);
        caja_control_Window.webContents.send(sendChannel, info);
    } catch (error) {
        console.error(`Error al obtener datos: ${query}`, error);
        dialog.showErrorBox("Error de Base de Datos", "No se pudo cargar la información de caja.");
        // Opcional: Enviar un error al renderizador
        // caja_control_Window.webContents.send(sendChannel, { error: true }); 
    } finally {
        await DB.cerrar();
    }
}

/**
 * Función genérica para guardar un registro de historial de caja.
 * @param {object} status - Objeto con { estado, dinero, fecha }.
 */
async function guardarHistorial(status,mensaje) {
    try {
        await DB.conectar();
        await DB.crear('INSERT INTO Historial_de_caja (estado,dinero,fecha) VALUES (?,?,?)', [status.estado, status.dinero, status.fecha] ); console.log(`Registro de caja guardado: ${status.estado}`);
    } catch (error) {
        console.error("Error al guardar historial de caja:", error);
        dialog.showErrorBox("Error de Base de Datos", "No se pudo guardar el estado de la caja.");
    } finally {
        await DB.cerrar();
        if(mensaje==="cierre"){
            caja_control_Window.webContents.send("indicar-cierre-de-app")
        }
        
    }
}


// -----------------------------------------------------------------
// LISTENERS DE IPC (COMUNICACIÓN INTER-PROCESOS)
// -----------------------------------------------------------------

// --- Lectura de Datos ---

ipcMain.on("data-caja-dinero-apertura", (event) => {
    // Obtener el último registro de historial para la apertura
    getLatestData(
        'SELECT * FROM Historial_de_caja ORDER BY key DESC LIMIT 1', 
        "status-caja-dinero-apertura"
    );
});

ipcMain.on("data-caja-dinero-cierre", (event) => {
    // Obtener el último registro de dinero almacenado para el cierre
    getLatestData(
        'SELECT * FROM Dinero_Almacenado ORDER BY key DESC LIMIT 1', 
        "status-caja-dinero-cierre"
    );
});


// --- Escritura de Datos ---

ipcMain.on("guardar-status-caja-apertura", (event, status) => {
   
    guardarHistorial(status);
});

ipcMain.on("guardar-status-caja-cierre", (event, status) => {
    
     guardarHistorial(status,"cierre");

});


// -----------------------------------------------------------------
// EXPORTACIÓN DE FUNCIONES
// -----------------------------------------------------------------

module.exports = {
    caja_control: caja_control,
};