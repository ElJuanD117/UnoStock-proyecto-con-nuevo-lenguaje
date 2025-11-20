const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
let DB_Path = path.join(__dirname,'./UnoStock.db');
/*-----------------------*/
const db = new sqlite3.Database(DB_Path);
/**
 * Guarda una venta completa en las tablas clientes, ventas, detalle_venta y movimientos
 * @param {Object} data - Objeto con comprador y productos
 * @returns {Promise} - Promesa con el resultado de la operación
 */
function guardarVenta(data) {
  const fecha = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      // 1. Insertar o actualizar cliente
      db.run(
        `INSERT INTO clientes (nombre, ci, telefono) VALUES (?,?,?)
         ON CONFLICT(ci) DO UPDATE SET nombre=excluded.nombre, telefono=excluded.telefono`,
        [data.comprador.nombre, data.comprador.ci, data.comprador.tlf],
        function (err) {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          // Obtener el id del cliente
          db.get(`SELECT id FROM clientes WHERE ci = ?`, [data.comprador.ci], (err2, clienteRow) => {
            if (err2) {
              db.run('ROLLBACK');
              return reject(err2);
            }

            const clienteId = clienteRow.id;

            // 2. Insertar venta vinculada al cliente
            db.run(
              `INSERT INTO ventas (cliente, ci, telefono, fecha) VALUES (?, ?, ?, ?)`,
              [data.comprador.nombre, data.comprador.ci, data.comprador.tlf, fecha],
              function (err3) {
                if (err3) {
                  db.run('ROLLBACK');
                  return reject(err3);
                }

                const ventaId = this.lastID;

                // 3. Insertar productos en detalle_venta
                const stmt = db.prepare(
                  `INSERT INTO detalle_venta (venta_id, cod, producto, cantidad, precio, descuento, total)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`
                );

                let productosProcesados = 0;
                let errorEnProductos = false;

                data.productos.forEach(p => {
                  stmt.run(
                    ventaId,
                    p.cod,
                    p.nombre,
                    parseInt(p.cant),
                    parseFloat(p.precio),
                    parseFloat(p.descuento),
                    parseFloat(p.preciototal),
                    function (err) {
                      productosProcesados++;
                      if (err && !errorEnProductos) {
                        errorEnProductos = true;
                        stmt.finalize();
                        db.run('ROLLBACK');
                        return reject(err);
                      }
                      if (productosProcesados === data.productos.length && !errorEnProductos) {
                        stmt.finalize();

                        // 4. Registrar movimiento
                        db.run(
                          `INSERT INTO movimientos (tipo, descripcion, fecha) VALUES (?, ?, ?)`,
                          ['venta', `Venta registrada para ${data.comprador.nombre}`, fecha],
                          (err4) => {
                            if (err4) {
                              db.run('ROLLBACK');
                              return reject(err4);
                            }
                            db.run('COMMIT');
                            resolve({ status: 'ok', ventaId, clienteId });
                          }
                        );
                      }
                    }
                  );
                });
              }
            );
          });
        }
      );
    });
  });
}

module.exports = guardarVenta;

/*--------------------------------------------------------------------*/
/*
const guardarVenta = require('./guardarVenta');

const ventaEjemplo = {
  comprador: { nombre: "luis", ci: "12860814", tlf: "045789456" },
  productos: [
    { cod: "445844", nombre: "lupa", precio: "50.00", descuento: "1.00", cant: "1", preciototal: "49.00" },
    { cod: "454845245245", nombre: "helado", precio: "20.00", descuento: "0.00", cant: "1", preciototal: "20.00" }
  ]
};

guardarVenta(ventaEjemplo)
  .then(res => console.log("Venta guardada:", res))
  .catch(err => console.error("Error:", err));
*/
/*-----------------------------------------------------------------*/
/*
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  ci TEXT UNIQUE,
  telefono TEXT
);

CREATE TABLE IF NOT EXISTS ventas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente TEXT NOT NULL,
  ci TEXT,
  telefono TEXT,
  fecha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS detalle_venta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id INTEGER,
  cod TEXT,
  producto TEXT,
  cantidad INTEGER,
  precio REAL,
  descuento REAL,
  total REAL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id)
);

CREATE TABLE IF NOT EXISTS movimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT,
  descripcion TEXT,
  fecha TEXT
);


Tabla ventas
Registra la información general de cada venta realizada.

id: Identificador único de la venta (autoincremental).

cliente: Nombre del comprador.

ci: Documento de identidad del cliente (cédula, pasaporte, etc.).

telefono: Teléfono de contacto del cliente.

fecha: Fecha y hora en que se realizó la venta.

👉 Esta tabla es el encabezado de la venta. Cada registro representa una transacción completa.

📦 Tabla detalle_venta
Contiene los productos vendidos en cada transacción. Se relaciona con ventas mediante venta_id.

id: Identificador único del detalle (autoincremental).

venta_id: Clave foránea que apunta al id de la tabla ventas.

cod: Código único del producto (SKU, referencia).

producto: Nombre del producto vendido.

cantidad: Número de unidades vendidas de ese producto.

precio: Precio unitario del producto.

descuento: Descuento aplicado a ese producto.

total: Precio final calculado (cantidad × precio − descuento).

👉 Esta tabla es el detalle de la venta. Una venta puede tener múltiples productos, por lo que aquí se registran varias filas asociadas a un mismo venta_id.

📊 Tabla movimientos
Registra las acciones o eventos importantes del sistema, útil para auditoría o historial.

id: Identificador único del movimiento (autoincremental).

tipo: Tipo de movimiento (ejemplo: "venta", "anulación", "actualización").

descripcion: Texto descriptivo del movimiento (ejemplo: "Venta registrada para Luis").

fecha: Fecha y hora en que ocurrió el movimiento.
  */