// backend/models/venta.js
const db = require('../connecThis');
const { getEmpresaDb } = require('../connecThis');


// Crear tabla si no existe
async () => db.query(`
CREATE TABLE ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME NOT NULL,
  productos TEXT NOT NULL,
  precio_total DECIMAL(10,2) NOT NULL,
  cliente VARCHAR(255),
  metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
  cantidad INT NOT NULL,
  firma_integridad VARCHAR(128) NOT NULL
);

`, (err) => {
  if (err) {
    console.error('Error creando tabla ventas:', err.message);
  } else {
    console.log('Tabla ventas verificada o creada');
  }
});


module.exports = db;
