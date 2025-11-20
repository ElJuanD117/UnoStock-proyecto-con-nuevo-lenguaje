const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
let DB_Path = path.join(__dirname,'./UnoStock.db');
/*-----------------------*/
const db = new sqlite3.Database(DB_Path);
/**
 * Genera N ventas de ejemplo usando productos ya existentes
 * @param {number} cantidadVentas - número de ventas a generar
 */
function generarVentasEjemplo(cantidadVentas = 5) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM productos`, [], (err, productos) => {
      if (err) return reject(err);
      if (productos.length === 0) return reject("No hay productos en la tabla");

      db.serialize(() => {
        for (let v = 1; v <= cantidadVentas; v++) {
          const fecha = new Date().toISOString();
          const cliente = `Cliente_${v}`;
          const ci = `CI${1000 + v}`;
          const telefono = `0414${Math.floor(Math.random() * 1000000)}`;

          // Insertar venta
          db.run(
            `INSERT INTO ventas (cliente, ci, telefono, fecha) VALUES (?, ?, ?, ?)`,
            [cliente, ci, telefono, fecha],
            function (err2) {
              if (err2) return reject(err2);

              const ventaId = this.lastID;

              // Seleccionar aleatoriamente 2-3 productos para esta venta
              const productosSeleccionados = [];
              for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * productos.length);
                productosSeleccionados.push(productos[randomIndex]);
              }

              const stmt = db.prepare(
                `INSERT INTO detalle_venta (venta_id, cod, producto, cantidad, precio, descuento, total)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
              );

              productosSeleccionados.forEach(p => {
                const cantidad = Math.floor(Math.random() * 5) + 1;
                const descuento = parseFloat(p.descuento || 0);
                const total = (p.precio * cantidad) - descuento;

                stmt.run(
                  ventaId,
                  p.cod,
                  p.nombre,
                  cantidad,
                  p.precio,
                  descuento,
                  total
                );
              });

              stmt.finalize();

              // Registrar movimiento
              db.run(
                `INSERT INTO movimientos (tipo, descripcion, fecha) VALUES (?, ?, ?)`,
                ['venta', `Venta registrada para ${cliente}`, fecha]
              );
            }
          );
        }
        resolve({ status: 'ok', ventasGeneradas: cantidadVentas });
      });
    });
  });
}

module.exports = generarVentasEjemplo;



/*************************

const generarVentasEjemplo = require('./generarVentasEjemplo');

generarVentasEjemplo(10)
  .then(res => console.log("Ventas generadas:", res))
  .catch(err => console.error("Error:", err));


*************************/