// Ruta en Express: productos.js
const express = require('express');
const router = express.Router();
const verificarLicencia = require('../middlewares/verifyLicense');

const verificarRol = require('../middlewares/verificationRol');

const { getEmpresaDb } = require('../connecThis');
const verifyToken = require('../middlewares/verifyToken');
router.use(verifyToken); // siempre primero verificar el token
router.use(verificarRol(['admin'])); // aplicar verificación de rol global
const {  rolesPro} = require('../helpers/roles');


router.post('/carga-masiva', verifyToken, verificarRol(rolesPro),  verificarLicencia, async (req, res) => {
  const empresa_id = req.user.empresa_id;
  const productos = req.body.productos;

  if (!Array.isArray(productos)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const db = await getEmpresaDb(empresa_id);
    let insertados = 0;

    for (const producto of productos) {
      const { nombre, codigoBarras, precio, cantidad, tipo } = producto;
      if (!nombre || !codigoBarras) continue;

      await db.query(
        `INSERT INTO productos (nombre, codigoBarras, precio, cantidad, tipo)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, codigoBarras, precio || 0, cantidad || 0, tipo || 'Sin categoría']
      );

      insertados++;
    }

    res.json({ mensaje: `Carga completada. Se insertaron ${insertados} productos.`, insertados });
  } catch (error) {
    console.error('Error en carga masiva:', error);
    res.status(500).json({ error: 'Error al guardar los productos' });
  }
});

module.exports = router;
