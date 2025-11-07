const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
/*--------------------------------------------------*/

class UnoStockDB {
  constructor(dbPath = 'UnoStock.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    // Verifica si la base de datos existe, si no la crea y ejecuta un callback para crear tablas
    verificarOCrearDB(callbackCrearTablas) {
        const existe = fs.existsSync(this.dbPath);
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err.message);
            } else {
                if (!existe && typeof callbackCrearTablas === 'function') {
                    // Si no existía, ejecuta el callback para crear las tablas iniciales
                    callbackCrearTablas(this);
                }
            }
        });
        return existe;
    }

    conectarBD(rutaDB = 'UnoStock.db') {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(rutaDB, (err) => {
                if (err) {
                    console.error('Error al conectar con la base de datos:', err.message);
                    reject(err);
                } else {
                    console.log('Conexión exitosa a la base de datos:', rutaDB);
                    resolve(db);
                }
                    });
                });
        }

    // Crear una tabla (ejemplo)
    crearTabla(sql){
        return new Promise((resolve, reject) => {
            this.db.run(sql, function(err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    // Crear (Insertar)
    Insertar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    // Leer (Obtener todos)
    leer(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Buscar (Obtener uno)
    buscar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Actualizar
    actualizar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    // Borrar
    borrar(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    // Cerrar conexión
    cerrar() {
        this.db.close((err) => {
            if (err) {
                console.error('Error al cerrar la base de datos:', err.message);
            } else {
                console.log('Conexión cerrada.');
            }
        });
    }
    //Limpiar tablas
    limpiarTablas() {
        return new Promise((resolve, reject) => {
            // Obtener la lista de tablas del esquema
            this.db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
                [],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    // Ejecutar DELETE para cada tabla
                    const tablas = rows.map(row => row.name);
                    let pendientes = tablas.length;
                    if (pendientes === 0) resolve();
                    tablas.forEach(tabla => {
                        this.db.run(`DELETE FROM ${tabla};`, [], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            pendientes--;
                            if (pendientes === 0) resolve();
                        });
                    });
                }
            );
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