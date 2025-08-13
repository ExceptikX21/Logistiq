

const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');
const { generarFirma, verificarFirmaMiddleware } = require('../middlewares/firmaIntegridad.js')
const verificarLicencia = require('../middlewares/verifyLicense');
const { rolesAdmin, rolesPro } = require('../helpers/roles');

const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta
console.log(typeof verificarRol); // debe imprimir "function"


const { getEmpresaDb } = require('../connecThis');
const express = require('express');
const router = express.Router();
router.use(verifyToken); // siempre primero verificar el token
router.use(verificarLicencia); // verificar licencia antes de cualquier operación
// Get all orders
router.get('/api/orders', verificarRol(rolesAdmin),verifyToken, attachDbHybrid,  async (req, res) => {
  try {
      const empresa_id = req.empresa_id;
      const db = req.db;

      let query = 'SELECT * FROM orders';
      let params = [];

      if (req.tipo_acceso === 'compartida') {
          query += ' WHERE empresa_id = ?';
          params.push(empresa_id);
      }

      const [orders] = await db.execute(query, params);
      return res.json(orders);
  } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      return res.status(500).json({ 
          error: 'Error al obtener las órdenes',
          details: err.message 
      });
  }
});

// Get order by orderNumber
router.get('/api/orders/search', verifyToken, attachDbHybrid, verificarRol(rolesPro), async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;
  
    if (!query) return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
  
    const offset = (page - 1) * limit;
    const db = req.db;
    const empresa_id = req.empresa_id;
    const tipo_acceso = req.tipo_acceso;
  
    try {
      const searchTerm = `%${query}%`;
  
      // Campos de búsqueda: ajusta según tus columnas
      let whereClause = `
        WHERE (orderNumber LIKE ? OR status LIKE ? OR supplier LIKE ? OR details LIKE ? OR date LIKE ? OR total LIKE ?) `;
  
      const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
  
      // Filtro por empresa en modo compartido
      if (tipo_acceso === 'compartida') {
        whereClause += ' AND empresa_id = ?';
        params.push(empresa_id);
      }
  
      // Obtener total de coincidencias
      const [countResult] = await db.query(
        `SELECT COUNT(*) AS total FROM orders ${whereClause}`,
        params
      );
  
      // Obtener resultados con paginación
      const [results] = await db.query(
        `SELECT * FROM orders ${whereClause}
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
      );
  
      res.json({
        orders: results,
        total: countResult[0].total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      });
  
    } catch (err) {
      console.error('Error al buscar órdenes:', err);
      res.status(500).json({ error: 'Error interno al buscar órdenes' });
    }
  });
  

// Create new order
router.post('/api/orders', verifyToken, attachDbHybrid,  verificarRol(rolesAdmin), async (req, res) => {
  try {
      const empresa_id = req.empresa_id;
      const { orderNumber, date, supplier, details, status, total } = req.body;
      const db = req.db;

      if (!orderNumber || !date || !supplier || !status || !total) {
          return res.status(400).json({ 
              error: 'Faltan campos requeridos',
              required: ['orderNumber', 'date', 'supplier', 'status', 'total']
          });
      }

      const query = `
          INSERT INTO orders 
          (orderNumber, date, supplier, details, status, total${req.tipo_acceso === 'compartida' ? ', empresa_id' : ''})
          VALUES (?, ?, ?, ?, ?, ?${req.tipo_acceso === 'compartida' ? ', ?' : ''})
      `;

      const params = [orderNumber, date, supplier, details, status, total];
      if (req.tipo_acceso === 'compartida') {
          params.push(empresa_id);
      }

      const [result] = await db.execute(query, params);

      return res.status(201).json({ 
          id: result.insertId, 
          orderNumber, 
          date, 
          supplier, 
          details, 
          status, 
          total 
      });
  } catch (err) {
      console.error('Error al crear la orden:', err);
      return res.status(500).json({ 
          error: 'Error al crear la orden',
          details: err.message 
      });
  }
});

// Update order
router.put('/orders/:id', verifyToken, attachDbHybrid,  verificarRol(rolesAdmin), async (req, res) => {
  try {
      const empresa_id = req.empresa_id;
      const orderId = req.params.id;
      const { date, supplier, details, status, total, updated_at } = req.body;
      const username = req.user.username;
      const db = req.db;

      if (!date || !supplier || !status || !updated_at) {
          return res.status(400).json({ 
              error: 'Campos requeridos faltantes',
              required: ['date', 'supplier', 'status', 'updated_at']
          });
      }

      const newUpdatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      let query = `
          UPDATE orders 
          SET date = ?, supplier = ?, details = ?, status = ?, total = ?, updated_at = ?
          WHERE id = ? AND updated_at = ?
      `;
      let params = [date, supplier, details, status, total, newUpdatedAt, orderId, updated_at];

      if (req.tipo_acceso === 'compartida') {
          query += ' AND empresa_id = ?';
          params.push(empresa_id);
      }

      const [result] = await db.execute(query, params);

      if (result.affectedRows === 0) {
          return res.status(409).json({ 
              error: 'La orden fue modificada por otro usuario o no existe'
          });
      }

      // Registrar log
      const now = new Date();
      const fechaHora = now.toISOString().slice(0, 19).replace('T', ' ');
      const ip = req.ip;

      await db.execute(
          'INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)',
          [username, orderId, 'update', fechaHora, ip]
      );


      //registrar logs modificaciones
      if(req.tipo_acceso === 'compartida') {
          await db.execute(
              'INSERT INTO logs_modificaciones (usuario, empresa_id, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?, ?)',
              [username, empresa_id, orderId, 'update', fechaHora, ip]
          );
      }

      return res.json({ 
          id: orderId, 
          date, 
          supplier, 
          details, 
          status, 
          total, 
          updated_at: newUpdatedAt 
      });
  } catch (err) {
      console.error('Error al actualizar la orden:', err);
      return res.status(500).json({ 
          error: 'Error al actualizar la orden',
          details: err.message 
      });
  }
});

// Delete order
router.delete('/orders/:id', verifyToken, attachDbHybrid,  verificarRol(rolesAdmin), async (req, res) => {
  try {
      const empresa_id = req.empresa_id;
      const orderId = req.params.id;
      const db = req.db;

      let query = 'DELETE FROM orders WHERE id = ?';
      let params = [orderId];

      if (req.tipo_acceso === 'compartida') {
          query += ' AND empresa_id = ?';
          params.push(empresa_id);
      }

      const [result] = await db.execute(query, params);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Orden no encontrada' });
      }

      return res.json({ id: orderId });
  } catch (err) {
      console.error('Error al eliminar la orden:', err);
      return res.status(500).json({ 
          error: 'Error al eliminar la orden',
          details: err.message 
      });
  }
});


module.exports = router;