const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
let DB_Path = path.join(__dirname,'./UnoStock.db');
/*-----------------------*/
const db = new sqlite3.Database(DB_Path);

/**
 * Genera 40 productos y categorías (1 categoría cada 4 productos)
 */
function generarProductos() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const categorias = [];
      const productos = [];

      // Crear 10 categorías (porque 40 / 4 = 10)
      for (let i = 1; i <= 10; i++) {
        categorias.push({ nombre: `Categoria_${i}` });
      }

      // Insertar categorías en la tabla
      const stmtCat = db.prepare(`INSERT INTO categoria (nombre) VALUES (?)`);
      categorias.forEach(cat => stmtCat.run(cat.nombre));
      stmtCat.finalize();

      // Obtener IDs de categorías insertadas
      db.all(`SELECT * FROM categoria ORDER BY key ASC`, [], (err, rows) => {
        if (err) return reject(err);

        // Generar 40 productos, asignando cada 4 a una categoría
        let catIndex = 0;
        for (let i = 1; i <= 40; i++) {
          const categoria = rows[catIndex].nombre;
          productos.push({
            cod: `P${1000 + i}`,
            cod_Empresa: `EMP${i}`,
            nombre: `Producto_${i}`,
            precio: (Math.random() * 100 + 10).toFixed(2),
            iva: 16.00,
            descuento: (Math.random() * 5).toFixed(2),
            image:path.join(__dirname,'UnoStock.png'),
            categoria: categoria,
            cant: Math.floor(Math.random() * 50) + 1
          });

          // Cada 4 productos, cambiar de categoría
          if (i % 4 === 0) catIndex++;
        }

        // Insertar productos en la tabla
        const stmtProd = db.prepare(`
          INSERT INTO productos (cod, cod_Empresa, nombre, precio, iva, descuento, image, categoria, cant)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        productos.forEach(p => {
          stmtProd.run(
            p.cod,
            p.cod_Empresa,
            p.nombre,
            parseFloat(p.precio),
            p.iva,
            parseFloat(p.descuento),
            p.image,
            p.categoria,
            p.cant
          );
        });

        stmtProd.finalize();
        resolve({ status: 'ok', categorias: categorias.length, productos: productos.length });
      });
    });
  });
}

module.exports = generarProductos;
