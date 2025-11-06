const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // sirve index.html

const dbPath = path.join(__dirname, 'data-base', 'login.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error al conectar con la base de datos:', err.message);
  else console.log('Conectado a la base de datos SQLite.');
});

db.run('PRAGMA foreign_keys = ON');

function generarCodigoUsuario(nombre, apellido) {
  const ini = (nombre?.[0] || 'X').toUpperCase() + (apellido?.[0] || 'X').toUpperCase();
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `${ini}${rnd}`;
}

// Crear rol
app.post('/api/roles', (req, res) => {
  const { Id_rol, Nombre_rol, permisos } = req.body;
  if (Id_rol == null || !Nombre_rol || !permisos) {
    return res.status(400).json({ error: 'Id_rol, Nombre_rol y permisos son requeridos' });
  }
  db.run(`INSERT INTO ROLES (Id_rol, Nombre_rol, permisos) VALUES (?, ?, ?)`,
    [Id_rol, Nombre_rol, permisos],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ Id_rol });
    });
});

// Listar roles
app.get('/api/roles', (req, res) => {
  db.all(`SELECT Id_rol, Nombre_rol FROM ROLES ORDER BY Id_rol`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear usuario
app.post('/api/usuarios', (req, res) => {
  const { id_rol, Nombre, Apellido, F_Nacimiento, Dirección, Usuario, contrasena } = req.body;
  if (!id_rol || !Nombre || !Apellido || !Usuario || !contrasena) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  db.get('SELECT Id_rol FROM ROLES WHERE Id_rol = ?', [id_rol], (err, rol) => {
    if (err || !rol) return res.status(404).json({ error: 'Rol no válido' });

    const COD_User = generarCodigoUsuario(Nombre, Apellido);
    const sql = `
      INSERT INTO Usuarios (COD_User, id_rol, Nombre, Apellido, F_Nacimiento, Dirección, Usuario, contrasena)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [COD_User, id_rol, Nombre, Apellido, F_Nacimiento, Dirección, Usuario, contrasena], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      const { lastID } = this;
      res.json({ id_usuario: lastID, COD_User });
    });
  });
});

// Listar usuarios
app.get('/api/usuarios', (req, res) => {
  const sql = `
    SELECT u.id_usuario, u.COD_User, u.Nombre, u.Apellido, u.F_Nacimiento, u.Dirección, u.Usuario,
           r.Nombre_rol
    FROM Usuarios u
    JOIN ROLES r ON u.id_rol = r.Id_rol
    ORDER BY u.id_usuario DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM Usuarios WHERE id_usuario = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { id_rol, Nombre, Apellido, F_Nacimiento, Dirección, Usuario, contrasena } = req.body;
  const sql = `
    UPDATE Usuarios SET
      id_rol = ?,
      nombre = ?,
      apellido = ?,
      f_Nacimiento = ?,
      dirección = ?,
      usuario = ?,
      contrasena = ?
    WHERE id_usuario = ?
  `;
  db.run(sql, [id_rol, Nombre, Apellido, F_Nacimiento, Dirección, Usuario, contrasena, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const { changes } = this;
    res.json({ updated: changes });
  });
});
// Borrar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Usuarios WHERE id_usuario = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const { changes } = this;
    res.json({ deleted: changes });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});