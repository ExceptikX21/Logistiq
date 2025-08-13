const express = require('express');
const router = express.Router();
const verificarLicencia = require('../middlewares/verifyLicense');


const { rolesAdmin, rolesPro, rolesAll } = require('../helpers/roles');

const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta

const verifyToken = require('../middlewares/verifyToken');


console.log(typeof verificarRol); // debe imprimir "function"


const { getEmpresaDb } = require('../connecThis');
const verificationRol = require('../middlewares/verificationRol');

router.use(verifyToken); // siempre primero verificar el token
router.use(verificarLicencia); // verificar licencia antes de cualquier operación

// Obtener todos los proveedores con paginación

router.get('/', verifyToken, verificationRol(rolesAll), attachDbHybrid,  async (req, res) => {

  console.log('🧠 ENTRANDO A /proveedores');
  console.log('Rol real:', req.user?.rol);

  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const empresa_id = req.user.empresa_id;
  const db = await getEmpresaDb(empresa_id);

  try {
    let query;
    let countQuery;
    let params;

    if (req.tipo_acceso === 'compartida') {
      query = `
        SELECT * FROM proveedores
        WHERE empresa_id = ? AND activo = TRUE
        ORDER BY id LIMIT ? OFFSET ?`;
      countQuery = `
        SELECT COUNT(*) AS total FROM proveedores
        WHERE empresa_id = ? AND activo = TRUE`;
      params = [req.empresa_id, Number(limit), Number(offset)];
    } else {
      // acceso dedicado
      query = `
        SELECT * FROM proveedores
        WHERE activo = TRUE
        ORDER BY id LIMIT ? OFFSET ?`;
      countQuery = `
        SELECT COUNT(*) AS total FROM proveedores
        WHERE activo = TRUE`;
      params = [Number(limit), Number(offset)];
    }

    const [count] = await db.query(
      countQuery,
      req.tipo_acceso === 'dedicada' ? [] : [req.empresa_id]
    );
    const [proveedores] = await db.query(query, params);

    res.json({
      suppliers: proveedores,
      total: count[0].total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count[0].total / limit)
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});


// Buscar proveedores
// Buscar proveedores
router.get('/search', verifyToken, attachDbHybrid, verificationRol(rolesAll),  async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  const offset = (page - 1) * limit;
  const db = req.db;
  const empresa_id = req.empresa_id;
  const tipo_acceso = req.tipo_acceso;

  try {
    const searchTerm = `%${query}%`;

    // Base query
    let whereClause = `WHERE (nombre LIKE ? OR contacto LIKE ? OR telefono LIKE ? OR email LIKE ?)`;
    let params = [searchTerm, searchTerm, searchTerm, searchTerm];

    // Agregar filtro empresa_id si es acceso compartido
    if (tipo_acceso === 'compartida') {
      whereClause += ` AND empresa_id = ?`;
      params.push(empresa_id);
    }

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM proveedores ${whereClause}`,
      params
    );

    const [results] = await db.query(
      `SELECT * FROM proveedores ${whereClause}
       ORDER BY id LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      suppliers: results,
      total: countResult[0].total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    console.error('Error al buscar proveedores:', err);
    res.status(500).json({ error: 'Error interno al buscar proveedores' });
  }
});

// Crear proveedor
router.post('/', verifyToken, attachDbHybrid, verificationRol(rolesAll),  async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;

  try {
    const empresa_id = req.empresa_id;
    const db = req.db;
    const tipo_acceso = req.tipo_acceso;

    // Si el acceso es compartido, se debe incluir el campo empresa_id en la tabla
    let insertQuery = 'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion';
    let insertValues = [nombre, contacto, telefono, email, direccion];
    let placeholders = '?, ?, ?, ?, ?';

    if (tipo_acceso === 'compartida') {
      insertQuery += ', empresa_id';
      placeholders += ', ?';
      insertValues.push(empresa_id);
    }

    insertQuery += `) VALUES (${placeholders})`;

    const [result] = await db.query(insertQuery, insertValues);

    const [proveedorCreado] = await db.query('SELECT * FROM proveedores WHERE id = ?', [result.insertId]);
    res.json(proveedorCreado[0]);
  } catch (err) {
    console.error('Error al crear proveedor:', err);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});


// Actualizar proveedor
router.put(
  '/:id',
  verifyToken,
  verificationRol(rolesAdmin), // Verificar rol de usuario
  attachDbHybrid, // ✅ Middleware para asignar la DB correcta y empresa_id
 
  async (req, res) => {
    const { id } = req.params;
    const { nombre, contacto, telefono, email, direccion, updated_at, activo } = req.body;
    const username = req.user.username;

    if (!updated_at) {
      return res.status(400).json({ error: 'Se requiere el campo updated_at' });
    }

    if (!nombre || !contacto || !telefono || !email || !direccion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
      const db = req.db; // conexión según el middleware
      const empresa_id = req.empresa_id; // empresa actual
      const tipo_acceso = req.tipo_acceso;
      const newUpdatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Query diferente si es compartida o dedicada
      let updateQuery;
      let params;

      if (tipo_acceso === 'compartida') {
        updateQuery = `
          UPDATE proveedores
          SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?, activo = ?, updated_at = ?
          WHERE id = ? AND updated_at = ? AND empresa_id = ?
        `;
        params = [nombre, contacto, telefono, email, direccion, activo, newUpdatedAt, id, updated_at, empresa_id];
      } else {
        // dedicada no necesita filtrar por empresa_id porque es base separada
        updateQuery = `
          UPDATE proveedores
          SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?, activo = ?, updated_at = ?
          WHERE id = ? AND updated_at = ?
        `;
        params = [nombre, contacto, telefono, email, direccion, activo, newUpdatedAt, id, updated_at];
      }

      const [result] = await db.query(updateQuery, params);

      if (result.affectedRows === 0) {
        return res.status(409).json({ error: 'El proveedor fue modificado por otro usuario o no existe' });
      }

      // Aquí podrías insertar logs si quieres, usando req.ip y username

      return res.json({
        id,
        nombre,
        contacto,
        telefono,
        email,
        direccion,
        activo,
        updated_at: newUpdatedAt,
      });

    } catch (err) {
      console.error('Error al actualizar proveedor:', err);
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  }
);



// Eliminar proveedor
router.delete('/:id', verifyToken, verificationRol(rolesAdmin), attachDbHybrid, verificarLicencia, async (req, res) => {
  const { id } = req.params;
  const empresa_id = req.user.empresa_id;
  const tipo_acceso = req.tipo_acceso;

  try {
    const db = req.db; // Viene del middleware híbrido

    let deleteQuery = `DELETE FROM proveedores WHERE id = ?`;
    let params = [id];

    if (tipo_acceso === 'compartida') {
      deleteQuery += ` AND empresa_id = ?`;
      params.push(empresa_id);
    }

    const [result] = await db.query(deleteQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado o no pertenece a esta empresa' });
    }

    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar proveedor:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
