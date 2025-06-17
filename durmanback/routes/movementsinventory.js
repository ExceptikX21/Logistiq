


const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');
const { generarFirma, verificarFirmaMiddleware } = require('../middlewares/firmaIntegridad.js')
const verificarLicencia = require('../middlewares/verifyLicense');

const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta
console.log(typeof verificarRol); // debe imprimir "function"

const { rolesAdmin, rolesPro, rolesAll } = require('../helpers/roles');

const { getEmpresaDb } = require('../connecThis');
const express = require('express');
const router = express.Router();



router.use(verifyToken); // siempre primero verificar el token
router.use(verificarRol(rolesPro)); // aplicar verificación de rol global
router.use(verificarLicencia); // verificar licencia



router.get('/', verifyToken, attachDbHybrid, async (req, res) => {
  try {
      const empresa_id = req.user.empresa_id;
      const db = req.db || await getEmpresaDb(empresa_id);

      let query = 'SELECT * FROM movimientos';
      let params = [];

      if (req.tipo_acceso === 'compartida') {
          query += ' WHERE empresa_id = ?';
          params.push(req.empresa_id);
      }

      query += ' ORDER BY id DESC';

      const [movimientos] = await db.query(query, params);

      // Verificar integridad de cada movimiento
      const movimientosVerificados = movimientos.map(movimiento => {
          const firmaEsperada = generarFirma({
              fecha: movimiento.fecha,
              producto_id: movimiento.producto_id,
              tipo: movimiento.tipo,
              cantidad: movimiento.cantidad,
              motivo: movimiento.motivo,
              usuario: movimiento.usuario
          });

          return {
              ...movimiento,
              integridad_valida: firmaEsperada === movimiento.firma_integridad
          };
      });

      res.json(movimientosVerificados);
  } catch (error) {
      console.error("Error al obtener movimientos:", error);
      res.status(500).json({ 
          error: 'Error al obtener movimientos', 
          detalle: error.message 
      });
  }
});

router.post('/create', verifyToken, attachDbHybrid, verificarRol(['admin']), async (req, res) => {
    const empresa_id = req.user.empresa_id;
    const db = req.db || await getEmpresaDb(empresa_id);
    const { producto_id, tipo, cantidad, motivo } = req.body;
    const usuario = req.user.username || req.user.correo;
  
    if (!producto_id || !tipo || !cantidad || !motivo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
  
    const fecha = new Date();
    const firma_integridad = generarFirma({ fecha, producto_id, tipo, cantidad, motivo, usuario });
  
    const conn = await db.getConnection();
    await conn.beginTransaction();
  
    try {
      // 1. Insertar movimiento
      const insertQuery = `
        INSERT INTO movimientos (
          producto_id, tipo, cantidad, motivo, usuario, fecha, firma_integridad
          ${req.tipo_acceso === 'compartida' ? ', empresa_id' : ''}
        ) VALUES (?, ?, ?, ?, ?, ?, ?${req.tipo_acceso === 'compartida' ? ', ?' : ''})
      `;
  
      const insertParams = [
        producto_id, tipo, cantidad, motivo, usuario, fecha, firma_integridad
      ];
      if (req.tipo_acceso === 'compartida') insertParams.push(req.empresa_id);
  
      await conn.query(insertQuery, insertParams);
  
      // 2. Obtener stock actual
      const [rows] = await conn.query(
        `SELECT cantidad FROM productos WHERE id = ?${req.tipo_acceso === 'compartida' ? ' AND empresa_id = ?' : ''}`,
        req.tipo_acceso === 'compartida' ? [producto_id, req.empresa_id] : [producto_id]
      );
  
      if (!rows.length) {
        throw new Error('Producto no encontrado');
      }
  
      const stockActual = rows[0].cantidad;
      let nuevoStock;
  
      if (tipo === 'entrada') {
        nuevoStock = stockActual + cantidad;
      } else if (tipo === 'salida') {
        nuevoStock = Math.max(stockActual - cantidad, 0);
      } else {
        throw new Error('Tipo de movimiento inválido');
      }
  
      // 3. Actualizar producto con nuevo stock
      const updateQuery = `
        UPDATE productos 
        SET cantidad = ? 
        WHERE id = ?
        ${req.tipo_acceso === 'compartida' ? ' AND empresa_id = ?' : ''}
      `;
  
      const updateParams = req.tipo_acceso === 'compartida'
        ? [nuevoStock, producto_id, req.empresa_id]
        : [nuevoStock, producto_id];
  
      await conn.query(updateQuery, updateParams);
  
      await conn.commit();
      res.status(200).json({ message: 'Movimiento registrado correctamente', firma_integridad });
    } catch (err) {
        await conn.rollback();
        console.error("Error en transacción de movimiento:", err);
      
        // Detectar violación de constraint de stock
        if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
          return res.status(400).json({
            error: 'No se puede realizar la operación: el stock no puede ser negativo.',
            code: err.code
          });
        }
      
        return res.status(500).json({
          error: 'Error al registrar movimiento',
          detalle: err.message
        });
      }
      finally {
      conn.release();
    }
  });
  

 module.exports = router;