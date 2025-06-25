const express = require('express');
const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta

const router = express.Router();
const db = require('../model/venta');
const crypto = require('crypto'); // <- Necesario para el hash
const jwt = require("jsonwebtoken");
const { rolesAdmin, rolesPro, rolesAll } = require('../helpers/roles');

const { getEmpresaDb } = require('../connecThis');
const verificarRol = require('../middlewares/verificationRol');

const verificarLicencia = require('../middlewares/verifyLicense');


// Middleware para verificar el rol del usuario

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  
  // Verifica si el token existe
  if (!token) return res.status(403).json({ error: "Token requerido" });

  // Asegúrate de que el token esté en el formato correcto: "Bearer <token>"
  const tokenPart = token.split(" ")[1];
  
  // Si no es un token "Bearer", regresa un error
  if (!tokenPart) return res.status(403).json({ error: "Token no válido" });

  // Verifica el token usando JWT
  jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = decoded; // Añade la información del usuario decodificado a la petición
    next(); // Pasa al siguiente middleware o ruta
  });
};

// Función para generar el hash
function generarFirma({ fecha, productos, precio_total, cliente, metodo_pago }) {
  const fechaFormateada = new Date(fecha).toISOString().slice(0, 19); // Normalizar fecha
  const productosLimpio = productos.trim();
  const clienteLimpio = cliente.trim();
  const metodoPagoLimpio = metodo_pago.trim();
  const precioLimpio = parseFloat(precio_total).toFixed(2); // Asegura que tenga 2 decimales

  const datos = `${fechaFormateada}|${productosLimpio}|${precioLimpio}|${clienteLimpio}|${metodoPagoLimpio}`;
  console.log("STRING USADO PARA HASH:", datos);
  return crypto.createHash('sha256').update(datos).digest('hex');
}


// Verificar la firma de integridad
function verificarFirma(venta) {
  const { fecha, productos, precio_total, cliente, metodo_pago, firma_integridad } = venta;
  const firmaCalculada = generarFirma({ fecha, productos, precio_total, cliente, metodo_pago });
  return firmaCalculada === firma_integridad;
}


/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Gestión de ventas
 */

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ventas
 *       400:
 *         description: Ventas con datos alterados
 *       500:
 *         description: Error del servidor
 */






// Listar ventas
router.get('/', verifyToken, attachDbHybrid, verificarRol(rolesAll), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const empresa_id = req.user.empresa_id;
    const db = req.db || await getEmpresaDb(empresa_id);

    // Base queries
    let query = 'SELECT * FROM ventas LIMIT ? OFFSET ?';
    let countQuery = 'SELECT COUNT(*) as total FROM ventas';
    let sumQuery = 'SELECT SUM(cantidad) as totalUnidades FROM ventas';
    let params = [Number(limit), Number(offset)];

    // Modify queries for shared access
    if (req.tipo_acceso === 'compartida') {
      query = 'SELECT * FROM ventas WHERE empresa_id = ? LIMIT ? OFFSET ?';
      countQuery = 'SELECT COUNT(*) as total FROM ventas WHERE empresa_id = ?';
      sumQuery = 'SELECT SUM(cantidad) as totalUnidades FROM ventas WHERE empresa_id = ?';
      params = [req.empresa_id, Number(limit), Number(offset)];
    }

    // Execute queries
    const [countResult] = await db.query(countQuery, req.tipo_acceso === 'dedicada' ? [] : [req.empresa_id]);
    const [sumResult] = await db.query(sumQuery, req.tipo_acceso === 'dedicada' ? [] : [req.empresa_id]);
    const [results] = await db.query(query, params);

    const totalProducts = countResult[0].total;
    const totalUnidades = sumResult[0].totalUnidades || 0;

    // Integrity verification
    const ventasConProblemas = results.filter(venta => !verificarFirma(venta));
    const inicio = Date.now();

    if (ventasConProblemas.length > 0) {
      console.error("Ventas con problemas de integridad:", ventasConProblemas);
      return res.status(400).json({
        error: 'Algunas ventas tienen datos alterados.',
        ventasConProblemas
      });
    }

    const duracion = Date.now() - inicio;
    console.log(`⏱️ Consulta ventas: ${duracion}ms`);

    res.json({
      ventas: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalProducts,
        totalUnidades,
        totalPages: Math.ceil(totalProducts / limit)
      },
      alert: 'aiAlertMessage',
    });
  } catch (err) {
    console.error("Error al obtener las ventas:", err);
    res.status(500).json({ error: err.message });
  }
});

// Crear venta
// Registrar venta
/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Registrar una nueva venta
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecha, productos, precio_total, cliente, metodo_pago, cantidad]
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               productos:
 *                 type: string
 *               precio_total:
 *                 type: number
 *               cliente:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Venta registrada
 *       500:
 *         description: Error del servidor
 */

router.post('/', verifyToken, attachDbHybrid, verificarRol(rolesPro), async (req, res) => {
  const empresa_id = req.user.empresa_id;
  const db = req.db || await getEmpresaDb(empresa_id);
  const { fecha, productos, precio_total, cliente, metodo_pago, cantidad } = req.body;

  const firma_integridad = generarFirma({ fecha, productos, precio_total, cliente, metodo_pago, cantidad });

  const query = `
    INSERT INTO ventas (fecha, productos, precio_total, cliente, metodo_pago, firma_integridad, cantidad${req.tipo_acceso === 'compartida' ? ', empresa_id' : ''})
    VALUES (?, ?, ?, ?, ?, ?, ?${req.tipo_acceso === 'compartida' ? ', ?' : ''})
  `;

  const params = [
    fecha, 
    productos, 
    precio_total, 
    cliente, 
    metodo_pago, 
    firma_integridad, 
    cantidad
  ];
  
  if (req.tipo_acceso === 'compartida') {
    params.push(req.empresa_id);
  }

  try {
    const [result] = await db.query(query, params);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Actualizar venta
/**
 * @swagger
 * /ventas/{id}:
 *   put:
 *     summary: Actualizar una venta existente
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               productos:
 *                 type: string
 *               precio_total:
 *                 type: number
 *               cliente:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Venta actualizada
 *       500:
 *         description: Error del servidor
 */

router.put('/:id', verifyToken, attachDbHybrid, verificarRol(rolesPro), async (req, res) => {
  const empresa_id = req.user.empresa_id;
  const db = req.db || await getEmpresaDb(empresa_id);
  const { fecha, productos, precio_total, cliente, metodo_pago, cantidad, updated_at } = req.body;

  if (!updated_at) {
    return res.status(400).json({ error: 'Se requiere el campo updated_at' });
  }

  const firma_integridad = generarFirma({ fecha, productos, precio_total, cliente, metodo_pago });
  const newUpdatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let query = `
    UPDATE ventas
    SET fecha = ?, productos = ?, precio_total = ?, cliente = ?, metodo_pago = ?, firma_integridad = ?, cantidad = ?, updated_at = ?
    WHERE id = ? AND updated_at = ?
  `;

  if (req.tipo_acceso === 'compartida') {
    query += ' AND empresa_id = ?';
  }

  const params = [
    fecha,
    productos,
    precio_total,
    cliente,
    metodo_pago,
    firma_integridad,
    cantidad,
    newUpdatedAt,
    req.params.id,
    updated_at
  ];

  if (req.tipo_acceso === 'compartida') {
    params.push(req.empresa_id);
  }

  try {
    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(409).json({ error: 'La venta fue modificada por otro usuario o no existe' });
    }

    res.json({
      message: 'Venta actualizada correctamente',
      updated_at: newUpdatedAt
    });
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    res.status(500).json({ error: err.message });
  }
});


// Eliminar venta
/**
 * @swagger
 * /ventas/{id}:
 *   delete:
 *     summary: Eliminar una venta
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a eliminar
 *     responses:
 *       200:
 *         description: Venta eliminada
 *       500:
 *         description: Error del servidor
 */

router.delete('/:id', verifyToken, attachDbHybrid, verificarRol(rolesPro), async (req, res) => {
  const empresa_id = req.user.empresa_id;
  const db = req.db || await getEmpresaDb(empresa_id);

  let query = 'DELETE FROM ventas WHERE id = ?';
  const params = [req.params.id];

  if (req.tipo_acceso === 'compartida') {
    query += ' AND empresa_id = ?';
    params.push(req.empresa_id);
  }

  try {
    const [result] = await db.query(query, params);
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verificación de integridad para una venta específica



// Verificación de integridad para una venta específica
/**
 * @swagger
 * api/ventas/debug-firma/{id}:
 *   get:
 *     summary: Verificar la integridad de una venta
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a verificar
 *     responses:
 *       200:
 *         description: Resultado de la verificación de la firma
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */

router.get('/debug-firma/:id', verifyToken, attachDbHybrid,  verificarRol(rolesPro), async (req, res) => {
  const empresa_id = req.user.empresa_id;
  const db = req.db || await getEmpresaDb(empresa_id);
  const ventaId = req.params.id;

  let query = 'SELECT * FROM ventas WHERE id = ?';
  const params = [ventaId];

  if (req.tipo_acceso === 'compartida') {
    query += ' AND empresa_id = ?';
    params.push(req.empresa_id);
  }

  try {
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    const venta = rows[0];
    const firmaCalculada = generarFirma({
      fecha: venta.fecha,
      productos: venta.productos,
      precio_total: venta.precio_total,
      cliente: venta.cliente,
      metodo_pago: venta.metodo_pago
    });

    const coinciden = firmaCalculada === venta.firma_integridad;

    res.json({
      id: venta.id,
      firma_guardada: venta.firma_integridad,
      firma_calculada: firmaCalculada,
      coinciden
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//buscar venta por id
router.get('/search', verifyToken, attachDbHybrid, verificarRol(rolesPro), async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  if (!query) return res.status(400).json({ error: 'El parámetro "query" es obligatorio' });

  const offset = (page - 1) * limit;
  const db = req.db;
  const empresa_id = req.empresa_id;
  const tipo_acceso = req.tipo_acceso;

  try {
    const searchTerm = `%${query}%`;

    // Campos que deseas permitir buscar (ajustables)
    let whereClause = `
      WHERE (cliente LIKE ? OR productos LIKE ? OR metodo_pago LIKE ? OR fecha LIKE ? OR precio_total LIKE ? OR cantidad LIKE ? OR id LIKE ?)
    `;
    let params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];

    if (tipo_acceso === 'compartida') {
      whereClause += ` AND empresa_id = ?`;
      params.push(empresa_id);
    }

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM ventas ${whereClause}`,
      params
    );

    const [results] = await db.query(
      `SELECT * FROM ventas ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      ventas: results,
      total: countResult[0].total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    console.error('Error al buscar ventas:', err);
    res.status(500).json({ error: 'Error interno al buscar ventas' });
  }
});

module.exports = router;
