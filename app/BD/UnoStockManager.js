const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
/*--------------------------------------------------*/

class UnoStockDB {
    constructor(dbPath = 'UnoStock.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    // Conectar a la base de datos (crea el archivo si no existe)
    conectar() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    // Crear tabla con SQL (ejemplo: CREATE TABLE IF NOT EXISTS ...)
    crearTabla(sql) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, function(err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    // Insertar datos (CREATE)
    crear(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    // Leer varios registros (READ)
    leer(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Buscar un solo registro (READ)
    buscar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Actualizar registros (UPDATE)
    actualizar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    // Borrar registros (DELETE)
    borrar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    // Listar todas las tablas existentes en la base de datos
    listarTablas() {
        return new Promise((resolve, reject) => {
            const query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';";
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.name));
            });
        });
    }

    // Limpiar (vaciar) todas las tablas (sin borrar estructura)
    limpiarTablas() {
        return new Promise((resolve, reject) => {
            this.listarTablas()
                .then(tablas => {
                    if (tablas.length === 0) return resolve();
                    let pendientes = tablas.length;
                    tablas.forEach(tabla => {
                        this.db.run(`DELETE FROM ${tabla};`, [], (err) => {
                            if (err) reject(err);
                            pendientes--;
                            if (pendientes === 0) resolve();
                        });
                    });
                })
                .catch(reject);
        });
    }

    // Cerrar la conexión a la base de datos
    cerrar() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
}

module.exports = UnoStockDB;
/*******************************************/
/****



db.verificarOCrearDB(async (dbInstance) => {
    // Crear tabla si la base de datos es nueva
    await dbInstance.crearTabla(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        cantidad INTEGER
    )`);
    console.log('Tabla productos creada.');
}).then((existe) => {
    if (existe) {
        console.log('La base de datos ya existía.');
    } else {
        console.log('La base de datos fue creada y se inicializó.');
    }
});


db.verificarOCrearDB().then(() => {
    db.limpiarTablas()
      .then(() => console.log('¡Todas las tablas han sido vaciadas!'))
      .catch(err => console.error('Error al limpiar tablas:', err));
});

*****/