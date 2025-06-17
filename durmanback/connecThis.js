// db/connectionManager.js
const mysql = require('mysql2/promise');
const { use } = require('./routes/ventas');


require('dotenv').config();




const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

async function getEmpresaDb(empresa_id) {
  const [rows] = await db.query('SELECT * FROM empresas WHERE id = ?', [empresa_id]);
  if (rows.length === 0) throw new Error('Empresa no registrada');

  const nombre_db = rows[0].database_name; // ✅


  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: nombre_db,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 1000,
  });
}

module.exports = { db, getEmpresaDb };
