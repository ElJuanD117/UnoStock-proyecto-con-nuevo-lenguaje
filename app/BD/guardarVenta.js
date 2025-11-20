const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
let DB_Path = path.join(__dirname,'./UnoStock.db');
/*-----------------------*/
const db = new sqlite3.Database(DB_Path);
/**
 * Guarda una venta completa en las tablas clientes, ventas, detalle_venta y movimientos
 * y actualiza el stock de productos.
 * @param {Object} data - Objeto con comprador y productos
 * @returns {Promise} - Promesa con el resultado de la operación
 */
function guardarVenta(data) {
  const fecha = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Insertar o actualizar cliente
      db.run(
        `INSERT INTO clientes (nombre, ci, telefono) VALUES (?, ?, ?)
         ON CONFLICT(ci) DO UPDATE SET nombre=excluded.nombre, telefono=excluded.telefono`,
        [data.comprador.nombre, data.comprador.ci, data.comprador.tlf],
        function (err) {
          if (err) return reject(err);

          // 2. Insertar venta
          db.run(
            `INSERT INTO ventas (cliente, ci, telefono, fecha) VALUES (?, ?, ?, ?)`,
            [data.comprador.nombre, data.comprador.ci, data.comprador.tlf, fecha],
            function (err2) {
              if (err2) return reject(err2);

              const ventaId = this.lastID;

              // 3. Insertar detalle de venta y actualizar stock
              const stmtDetalle = db.prepare(
                `INSERT INTO detalle_venta (venta_id, cod, producto, cantidad, precio, descuento, total)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
              );

              data.productos.forEach(p => {
                const cantidad = parseInt(p.cant);
                const precio = parseFloat(p.precio);
                const descuento = parseFloat(p.descuento);
                const total = parseFloat(p.preciototal);

                // Insertar detalle
                stmtDetalle.run(
                  ventaId,
                  p.cod,
                  p.nombre,
                  cantidad,
                  precio,
                  descuento,
                  total
                );

                // Actualizar stock en productos
                db.run(
                  `UPDATE productos SET cant = cant - ? WHERE cod = ?`,
                  [cantidad, p.cod],
                  function (err3) {
                    if (err3) console.error(`Error actualizando stock de ${p.cod}:`, err3.message);
                  }
                );
              });

              stmtDetalle.finalize();

              // 4. Registrar movimiento
              db.run(
                `INSERT INTO movimientos (tipo, descripcion, fecha) VALUES (?, ?, ?)`,
                ['venta', `Venta registrada para ${data.comprador.nombre}`, fecha],
                (err4) => {
                  if (err4) return reject(err4);
                  resolve({ status: 'ok', ventaId });
                }
              );
            }
          );
        }
      );
    });
  });
}

module.exports = guardarVenta;

/******************************

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

*******************************/