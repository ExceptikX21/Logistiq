
const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');
const { generarFirma, verificarFirmaMiddleware } = require('../middlewares/firmaIntegridad.js')
const verificarLicencia = require('../middlewares/verifyLicense');

const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta
console.log(typeof verificarRol); // debe imprimir "function"
const { rolesPro} = require('../helpers/roles');


const { getEmpresaDb } = require('../connecThis');
const express = require('express');
const router = express.Router();


router.use(verifyToken); // siempre primero verificar el token
router.use(verificarLicencia); // verificar licencia

router.get('/api/almacenes', verificarRol(rolesPro), verifyToken, attachDbHybrid, async (req, res) => {
    try {
      let query = `
        SELECT 
          a.id AS id,
          a.nombre AS nombre,
          a.x, a.y, a.width, a.height, a.path, a.tipo, a.capacidad_maxima,
          COALESCE(SUM(sa.cantidad), 0) AS totalStock,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'name', p.nombre,
                'quantity', sa.cantidad,
                'stock_id', sa.id,
                 'producto_id', sa.producto_id
              )
            ), 
            JSON_ARRAY()
          ) AS productos
        FROM almacenes a
        LEFT JOIN stock_almacen sa ON sa.almacen_id = a.id
        LEFT JOIN productos p ON sa.producto_id = p.id
      `;
  
      const params = [];
      
      // Añadir filtro por empresa si el acceso es compartido
      if (req.tipo_acceso === 'compartida') {
        query += ' WHERE a.empresa_id = ?';
        params.push(req.empresa_id);
      }
  
      query += ' GROUP BY a.id';
  
      const [results] = await req.db.query(query, params);
      
      // Resto del código igual...
      const almacenes = results.map(row => ({
        ...row,
        stockLevel: row.totalStock >= 200 ? 'high' : row.totalStock >= 100 ? 'medium' : 'low',
        productos: row.productos || []
      }));
  
      res.json(almacenes);
    } catch (err) {
      console.error('Error al obtener almacenes:', err);
      res.status(500).json({
        error: 'Error al obtener los almacenes',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });
  
  
  // POST /api/almacenes
  router.post('/api/almacenes', verificarRol(rolesPro), verifyToken, attachDbHybrid,  async (req, res) => {
    const { nombre, x, y, width, height, tipo } = req.body;
  
    // Validación de campos obligatorios
    if (!nombre || x == null || y == null || width == null || height == null || !tipo) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }
  
    try {
      // Para acceso compartido, debemos asegurarnos de incluir empresa_id
      if (req.tipo_acceso === 'compartida') {
        await req.db.query(
          `INSERT INTO almacenes (nombre, x, y, width, height, tipo, empresa_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [nombre, x, y, width, height, tipo, req.empresa_id]
        );
      } else {
        // Para acceso dedicado, la empresa_id podría ser opcional si la tabla no la requiere
        // Depende del esquema de tu base de datos
        await req.db.query(
          `INSERT INTO almacenes (nombre, x, y, width, height, tipo)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [nombre, x, y, width, height, tipo]
        );
      }
  
      res.json({ success: true, message: "Almacén registrado correctamente." });
    } catch (err) {
      console.error('Error guardando el almacén:', err);
      
      // Manejo específico de errores de integridad referencial
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Error de referencia: empresa no existe' });
      }
  
      res.status(500).json({ 
        error: 'Error al guardar el almacén',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });
  
  // DELETE /api/stock_almacen/:id
  router.delete('/api/stock_almacen/:id',verificarRol(rolesPro), verifyToken, attachDbHybrid,  async (req, res) => {
    const stockId = req.params.id;
  
    try {
      let query = `
        DELETE sa FROM stock_almacen sa
        JOIN almacenes a ON sa.almacen_id = a.id
        WHERE sa.id = ?
      `;
      
      const params = [stockId];
      
      // Para acceso compartido, añadir verificación de empresa
      if (req.tipo_acceso === 'compartida') {
        query += ' AND a.empresa_id = ?';
        params.push(req.empresa_id);
      }
  
      const [result] = await req.db.query(query, params);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: req.tipo_acceso === 'compartida' 
            ? 'Producto no encontrado o no tienes permiso' 
            : 'Producto no encontrado en el almacén'
        });
      }
  
      res.json({ 
        success: true,
        message: 'Producto eliminado correctamente del almacén',
        deletedId: stockId
      });
  
    } catch (err) {
      console.error('Error al eliminar producto del almacén:', err);
      
      // Manejo específico de errores de FK
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          error: 'No se puede eliminar - existe referencia en otros registros',
          solution: 'Elimine primero los registros asociados'
        });
      }
      
      res.status(500).json({ 
        error: 'Error al eliminar producto del almacén',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });
  
  // DELETE /api/almacenes/:id
  router.delete('/api/almacenes/:id', verifyToken, verificarRol(rolesPro), attachDbHybrid, async (req, res) => {
    const id = req.params.id;
  
    try {
      let query = 'DELETE FROM almacenes WHERE id = ?';
      const params = [id];
      
      // Solo añadir empresa_id si el acceso es compartido
      if (req.tipo_acceso === 'compartida') {
        query += ' AND empresa_id = ?';
        params.push(req.empresa_id);
      }
  
      const [result] = await req.db.query(query, params);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Almacén no encontrado' + (req.tipo_acceso === 'compartida' ? ' o no autorizado' : '')
        });
      }
  
      // Eliminar también el stock asociado (opcional)
      if (req.tipo_acceso === 'dedicada') {
        await req.db.query('DELETE FROM stock_almacen WHERE almacen_id = ?', [id]);
      } else {
        await req.db.query(
          `DELETE sa FROM stock_almacen sa
           INNER JOIN almacenes a ON sa.almacen_id = a.id
           WHERE sa.almacen_id = ? AND a.empresa_id = ?`,
          [id, req.empresa_id]
        );
      }
  
      res.json({ 
        success: true,
        message: 'Almacén y su stock asociado eliminados correctamente' 
      });
    } catch (err) {
      console.error('Error al eliminar almacén:', err);
      res.status(500).json({ 
        error: 'Error al eliminar almacén',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });
  
  // Crear stock en almacén
  router.post('/api/stock_almacen', verifyToken, verificarRol(rolesPro), attachDbHybrid, async (req, res) => {
    const { almacen_id, producto_id, cantidad } = req.body;
  
    // Validación mejorada
    if (!almacen_id || !producto_id || cantidad == null || isNaN(cantidad) || cantidad < 0) {
      return res.status(400).json({ 
        error: "Datos inválidos. Asegúrese de proporcionar almacen_id, producto_id y cantidad válida." 
      });
    }
  
    try {
      // Verificar que el almacén pertenece a la empresa (solo para acceso compartido)
      if (req.tipo_acceso === 'compartida') {
        const [almacen] = await req.db.query(
          'SELECT 1 FROM almacenes WHERE id = ? AND empresa_id = ?',
          [almacen_id, req.empresa_id]
        );
        
        if (almacen.length === 0) {
          return res.status(403).json({ 
            error: 'No tiene permiso para agregar stock a este almacén' 
          });
        }
      }
  
      // Verificar que el producto existe (común para ambos tipos de acceso)
      const [producto] = await req.db.query(
        'SELECT 1 FROM productos WHERE id = ?',
        [producto_id]
      );
      
      if (producto.length === 0) {
        return res.status(404).json({ error: 'El producto no existe' });
      }
  
      // Insertar o actualizar stock
      const query = `
        INSERT INTO stock_almacen (almacen_id, producto_id, cantidad)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
      `;
  
      const [results] = await req.db.query(query, [almacen_id, producto_id, cantidad]);
      
      res.json({ 
        success: true,
        message: results.affectedRows > 1 ? 
          'Stock actualizado correctamente' : 
          'Producto registrado en almacén correctamente',
        action: results.affectedRows > 1 ? 'updated' : 'created'
      });
    } catch (err) {
      console.error('Error al gestionar stock:', err);
      
      // Manejo específico de errores
      let errorMessage = 'Error al gestionar el stock';
      let statusCode = 500;
      
      switch(err.code) {
        case 'ER_DUP_ENTRY':
          errorMessage = 'El producto ya existe en el almacén';
          statusCode = 400;
          break;
        case 'ER_NO_REFERENCED_ROW_2':
          errorMessage = 'Referencia inválida (almacén o producto no existe)';
          statusCode = 404;
          break;
        case 'ER_TRUNCATED_WRONG_VALUE':
          errorMessage = 'Valor inválido para la cantidad';
          statusCode = 400;
          break;
      }
      
      res.status(statusCode).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });


  // Actualizar stock en almacén
  router.put('/api/stock_almacen', verifyToken, verificarRol(rolesPro), attachDbHybrid, async (req, res) => {
    const { almacen_id, producto_id, cantidad } = req.body;
  
    // Validación mejorada
    if (!almacen_id || !producto_id || cantidad == null || isNaN(cantidad) || cantidad < 0) {
      return res.status(400).json({ 
        error: "Datos inválidos. Asegúrese de proporcionar almacen_id, producto_id y cantidad válida." 
      });
    }
  
    // Actualizar stock
    try {
      const [results] = await req.db.query(
        'UPDATE stock_almacen SET cantidad = ? WHERE almacen_id = ? AND producto_id = ?',
        [cantidad, almacen_id, producto_id]
      );
      
      res.json({ 
        success: true,
        message: results.affectedRows > 0 ? 
          'Stock actualizado correctamente' : 
          'Producto registrado en almacén correctamente',
        action: results.affectedRows > 0 ? 'updated' : 'created'
      });
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      res.status(500).json({ error: 'Error al actualizar el stock' });
    }
  });

  module.exports = router;
  