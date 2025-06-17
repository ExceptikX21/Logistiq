// backend/routes/pedidos.js
const express = require('express');
const router = express.Router();
const verificarLicencia = require('../middlewares/verifyLicense');
const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta

const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');
const { getEmpresaDb } = require('../connecThis');

const { rolesAdmin, rolesPro, rolesAll } = require('../helpers/roles');

router.use(verifyToken); // siempre primero verificar el token
router.use(verificarRol(rolesPro)); // aplicar verificación de rol global
router.use(verificarLicencia); // verificar licencia antes de cualquier operación

// Listar pedidos automáticos
router.get('/', verifyToken, attachDbHybrid, async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;
    const db = req.db || await getEmpresaDb(empresa_id);

    let query = 'SELECT * FROM pedidos_automaticos';
    let params = [];

    if (req.tipo_acceso === 'compartida') {
      query += ' WHERE empresa_id = ?';
      params.push(req.empresa_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los pedidos automáticos:', err);
    res.status(500).json({ error: 'Error al obtener los pedidos automáticos', details: err.message });
  }
});

// Ruta para aprobar un pedido automático
router.put('/:id/aprobar', verifyToken, verificarRol(rolesAdmin) , attachDbHybrid, async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;
    const db = req.db || await getEmpresaDb(empresa_id);
    const pedidoId = req.params.id;

    let query = 'UPDATE pedidos_automaticos SET estado = "aprobado" WHERE id = ?';
    const params = [pedidoId];

    if (req.tipo_acceso === 'compartida') {
      query += ' AND empresa_id = ?';
      params.push(req.empresa_id);
    }

    const [result] = await db.query(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado o no tiene permiso para modificarlo' });
    }

    res.json({ message: 'Pedido aprobado con éxito' });
  } catch (err) {
    console.error('Error al aprobar el pedido:', err);
    res.status(500).json({ error: 'Error al aprobar el pedido', details: err.message });
  }
});

// Ruta para rechazar un pedido automático
router.put('/:id/rechazar', verificarRol(rolesAdmin), verifyToken, attachDbHybrid,  async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;
    const db = req.db || await getEmpresaDb(empresa_id);
    const pedidoId = req.params.id;

    let query = 'UPDATE pedidos_automaticos SET estado = "rechazado" WHERE id = ?';
    const params = [pedidoId];

    if (req.tipo_acceso === 'compartida') {
      query += ' AND empresa_id = ?';
      params.push(req.empresa_id);
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado o no tiene permiso para modificarlo' });
    }

    res.json({ message: 'Pedido rechazado con éxito' });
  } catch (err) {
    console.error('Error al rechazar el pedido:', err);
    res.status(500).json({ error: 'Error al rechazar el pedido', details: err.message });
  }
});

module.exports = router;
