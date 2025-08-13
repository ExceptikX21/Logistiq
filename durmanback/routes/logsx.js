const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');

const { getEmpresaDb } = require('../connecThis');

const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta
console.log(typeof verificarRol); // debe imprimir "function"

const verificarLicencia = require('../middlewares/verifyLicense');
const { rolesPro } = require('../helpers/roles');


const express = require('express');
const router = express.Router();
router.use(verifyToken); // siempre primero verificar el token
// aplicar verificación de rol global
router.use(verificarLicencia); // verificar licencia

router.get('/logxas', verificarRol(rolesPro), verifyToken, attachDbHybrid, async (req, res) => {
    try {
      const empresa_id = req.empresa_id;  // o req.user.empresa_id si así lo tienes definido
      const db = req.db;
      const tipo_acceso = req.tipo_acceso;
  
      let query = 'SELECT * FROM logs_modificaciones';
      let params = [];
  
      if (tipo_acceso === 'compartida') {
        query += ' WHERE empresa_id = ?';
        params.push(empresa_id);
      }
  
      query += ' ORDER BY fecha_hora DESC LIMIT 10';
  
      const [rows] = await db.query(query, params);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No se encontraron registros de logs.' });
      }
  
      return res.json(rows);
    } catch (err) {
      console.error('Error en /logxas:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  
// Exportar el router
module.exports = router;