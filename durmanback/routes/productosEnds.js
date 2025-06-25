
const fs = require('fs');
const path = require('path');



const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');
const { generarFirma, verificarFirmaMiddleware } = require('../middlewares/firmaIntegridad.js')
const verificarLicencia = require('../middlewares/verifyLicense');
const { rolesAdmin, rolesPro, rolesAll } = require('../helpers/roles');

const attachDbHybrid = require('../middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta
console.log(typeof verificarRol); // debe imprimir "function"


const { db: masterDb} = require('../connecThis');
const express = require('express');
const router = express.Router();

 
 
// Get all products with pagination and search
router.get('/productos', verificarLicencia, verifyToken, verificarRol(rolesAll), attachDbHybrid, async (req, res) => {
    
  console.log(verificarLicencia);
  
  try {
        const empresa_id = req.empresa_id;
        const db = req.db;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const nombre = req.query.nombre;
        const all = req.query.all === 'true';

        let whereClause = '';
        let queryParams = [];

        if (nombre) {
            whereClause = 'WHERE nombre LIKE ?';
            queryParams.push(`%${nombre}%`);
            
            if (req.tipo_acceso === 'compartida') {
                whereClause += ' AND empresa_id = ?';
                queryParams.push(empresa_id);
            }
        } else if (req.tipo_acceso === 'compartida') {
            whereClause = 'WHERE empresa_id = ?';
            queryParams.push(empresa_id);
        }

        // Count query
        let countQuery = 'SELECT COUNT(*) as total FROM productos';
        if (whereClause) {
            countQuery += ' ' + whereClause;
        }

        // Sum query
        let sumQuery = 'SELECT SUM(cantidad) as totalUnidades FROM productos';
        if (whereClause) {
            sumQuery += ' ' + whereClause;
        }

        // Main query
        let mainQuery = `SELECT * FROM productos ${whereClause}`;
        if (!all) {
            mainQuery += ` LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);
        }
        const [configRows] = await masterDb.query(
          `SELECT stock_minimo_global FROM configuraciones_empresa WHERE empresa_id = ?`,
          [empresa_id]


        );

        console.log('Configuración de stock mínimo global:', configRows);
        // AI analysis function
        const analyzeStockWithAI = (totalUnidades) => {
          const alertThreshold = parseInt(configRows[0]?.stock_minimo_global) || 4000; // fallback a 4000 si no está definido

            if (totalUnidades < alertThreshold) {
                return "Alerta: Tu inventario de productos está casi agotado. Puede que quieras revisar las opciones de reposición.";
            }

            const saludoArray = [
                "¡Hola! Todo en orden con el stock. 😊",
                "¡Buenas noticias! El inventario está en control.",
                "¡Hola! El stock está en niveles óptimos.",
                "¡Hola! Todo está funcionando bien con el inventario.",
                "¡Hola! El sistema no detecta problemas de stock por ahora.",
                "¡Hey! Todo se ve bien en el almacén.",
                "¡Hola! Bien hecho, el stock se mantiene estable.",
                "¡Hola! Parece que todo está fluyendo bien con el inventario.",
                "¡Hola! Tu inventario está perfectamente equilibrado.",
                "¡Saludos! El sistema muestra niveles saludables de stock."
            ];
            
            return saludoArray[Math.floor(Math.random() * saludoArray.length)] + 
                   `\nEl stock se encuentra dentro de los límites normales.`;
        };

        // Execute queries
        const [countResult] = await db.query(countQuery, queryParams.slice(0, whereClause ? queryParams.length - (all ? 0 : 2) : 0));
        const totalProducts = countResult[0].total;

        const [sumResult] = await db.query(sumQuery, queryParams.slice(0, whereClause ? queryParams.length - (all ? 0 : 2) : 0));
        const totalUnidades = sumResult[0].totalUnidades || 0;

        const aiAlertMessage = analyzeStockWithAI(totalUnidades);
        const inicio = Date.now();

        const [results] = await db.query(mainQuery, queryParams);
        const duracion = Date.now() - inicio;
        console.log(`⏱️ Consulta productos: ${duracion}ms`);

        res.json({
            products: results,
            pagination: {
                page,
                limit,
                totalProducts,
                totalUnidades,
                nombre
            },
            alert: aiAlertMessage,
        });

    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ 
            error: 'Error al obtener los productos',
            details: err.message 
        });
    }
});

// Get product by ID
router.get('/products/:id', verifyToken, verificarRol(rolesAll), attachDbHybrid, async (req, res) => {
    try {
        const empresa_id = req.empresa_id;
        const productId = req.params.id;
        const db = req.db;

        let query = 'SELECT * FROM productos WHERE id = ?';
        let params = [productId];

        if (req.tipo_acceso === 'compartida') {
            query += ' AND empresa_id = ?';
            params.push(empresa_id);
        }

        const [rows] = await db.query(query, params);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json(rows[0]);
    } catch (err) {
        console.error('Error al buscar el producto:', err);
        return res.status(500).json({ 
            error: 'Error al buscar el producto',
            details: err.message 
        });
    }
});

// Delete product
router.delete('/products/:id', verifyToken, verificarRol(rolesAdmin), attachDbHybrid, async (req, res) => {
    const db = req.db;
    const empresa_id = req.empresa_id;
    const tipoAcceso = req.tipo_acceso;
    const idProducto = req.params.id;
    const username = req.user.username;
  
    try {
      // Primero, obtener el producto para saber el nombre/ruta de la imagen
      let selectQuery = 'SELECT imagen FROM productos WHERE id = ?';
      let selectParams = [idProducto];
      if (tipoAcceso === 'compartida') {
        selectQuery += ' AND empresa_id = ?';
        selectParams.push(empresa_id);
      }
  
      const [rows] = await db.query(selectQuery, selectParams);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      const producto = rows[0];
      const rutaPublica = producto.imagen; // Ejemplo: '/uploads/3/3425e02789bf8d43997d64f5ffa7ccdf.webp'
  
      const rutaImagen = path.join(__dirname, '..',  rutaPublica);


      console.log('Ruta de la imagen a eliminar:', rutaImagen);
  
      // Eliminar el producto de la base de datos
      let deleteQuery = 'DELETE FROM productos WHERE id = ?';
      let deleteParams = [idProducto];
      if (tipoAcceso === 'compartida') {
        deleteQuery += ' AND empresa_id = ?';
        deleteParams.push(empresa_id);
      }


const fecha =  new Date().toISOString().slice(0, 19).replace('T', ' ');


        // Log the update
        const ipAddress = req.ip;
        await db.query(
            'INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)',
            [username, idProducto, 'delete', fecha,  ipAddress]
        );


        if(tipoAcceso === 'compartida') {
            await db.query(
                'INSERT INTO logs_modificaciones (usuario, empresa_id, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?, ?)',
                [username, empresa_id, idProducto, 'delete', fecha, ipAddress]
            );
        }

      await db.query(deleteQuery, deleteParams);
  
      // Eliminar el archivo físico
      fs.unlink(rutaImagen, (err) => {
        if (err) {
          console.error('Error al eliminar la imagen:', err);
        } else {
          console.log('Imagen eliminada correctamente');
        }
      });
  
      res.json({ success: true, message: 'Producto y su imagen eliminados correctamente', rutaImagen });
  
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error en el servidor al eliminar producto' });
    }
  });

// Update product
router.put('/products/:id', verifyToken, attachDbHybrid, verificarRol(rolesAdmin), async (req, res) => {
  try {
    const empresa_id = req.empresa_id;
    const productId = req.params.id;
    const { nombre, descripcion, cantidad, imagen, version } = req.body;
    const username = req.user.username;
    const db = req.db;

    if (!nombre || !descripcion || cantidad === undefined || version === undefined) {
      return res.status(400).json({ 
        error: 'Todos los campos (nombre, descripcion, cantidad, version) son requeridos'
      });
    }

    const nuevaFecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Construir la consulta
    let updateQuery = `
      UPDATE productos 
      SET nombre = ?, descripcion = ?, cantidad = ?, imagen = ?, updated_at = ?, version = version + 1 
      WHERE id = ? AND version = ?
    `;
    let updateParams = [
      nombre, 
      descripcion, 
      cantidad, 
      imagen,
      nuevaFecha,
      productId,
      version
    ];

    if (req.tipo_acceso === 'compartida') {
      updateQuery += ' AND empresa_id = ?';
      updateParams.push(empresa_id);
    }

    const [result] = await db.query(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return res.status(409).json({ 
        error: 'El producto fue modificado por otro usuario o no existe' 
      });
    }

    // Log de modificaciones
    const ipAddress = req.ip;

    await db.query(
      'INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)',
      [username, productId, 'update', nuevaFecha, ipAddress]
    );

    if (req.tipo_acceso === 'compartida') {
      await db.query(
        'INSERT INTO logs_modificaciones (usuario, empresa_id, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?, ?)',
        [username, empresa_id, productId, 'update', nuevaFecha, ipAddress]
      );
    }

console.log('Producto actualizado correctamente y log registrado', updateParams);

    // Devuelve el nuevo version y updated_at
    return res.json({
      id: productId,
      nombre,
      descripcion,
      cantidad,
      imagen,
      updated_at: nuevaFecha,
      version: version + 1
    });

  } catch (err) {
    if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      return res.status(400).json({
        error: 'No se puede realizar la operación: el stock no puede ser negativo.',
        code: err.code
      });
    }

    console.error('Error al actualizar el producto:', err);
    return res.status(500).json({ 
      error: 'Error al actualizar el producto',
      details: err.message 
    });
  }
});



/**
 * @swagger
 * tags:
 *   name: productos
 *   description: Buscar productos por código de barras
 */

/**
 * @swagger
 * /products/barcode/{codigo}:
 *   get:
 *     summary: Buscar producto por código de barras
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "7501031311309"  # Ejemplo real
 *       - in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *          routerlication/json:
 *             example:
 *               id: 1
 *               nombre: "Leche Entera 1L"
 *               codigoBarras: "7501031311309"
 *               precio: 25.50
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
*/


router.get('/api/products/barcode/:codigo', verifyToken, verificarRol(rolesPro), attachDbHybrid, async (req, res) => {
    const empresa_id = req.empresa_id;
    const codigo = req.params.codigo;
    const dbEmpresa = req.db;
  
    try {
      let query = 'SELECT * FROM productos WHERE codigoBarras = ?';
      let params = [codigo];
  
      if (req.tipo_acceso === 'compartida') {
        query += ' AND empresa_id = ?';
        params.push(empresa_id);
      }
  
      const [rows] = await dbEmpresa.query(query, params);
  
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al buscar producto por código de barras:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  });
  
  
  router.post('/api/saveproduct',  verifyToken, verificarRol(rolesAll),attachDbHybrid, async (req, res) => {
    const empresa_id = req.empresa_id;
    const username = req.user.username;
    const dbEmpresa = req.db;
    const tipoAcceso = req.tipo_acceso;
  
    const { nombre, codigoBarras, descripcion, cantidad, imagen } = req.body;
  
    // Validaciones
    if (!nombre || !codigoBarras || !descripcion || cantidad == null) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }
  
    if (isNaN(cantidad)) {
      return res.status(400).json({ error: "El campo 'cantidad' debe ser un número." });
    }
  
    try {
      // Verificar si el código de barras ya existe (considerando tipo acceso)
      let checkQuery = 'SELECT id FROM productos WHERE codigoBarras = ?';
      let checkParams = [codigoBarras];
  
      if (tipoAcceso === 'compartida') {
        checkQuery += ' AND empresa_id = ?';
        checkParams.push(empresa_id);
      }
  
      const [existing] = await dbEmpresa.query(checkQuery, checkParams);
  
      if (existing.length > 0) {
        return res.status(400).json({ error: 'El código de barras ya existe en esta empresa' });
      }
  
      // Insertar producto
      let insertQuery = `
        INSERT INTO productos (nombre, codigoBarras, descripcion, cantidad, imagen${tipoAcceso === 'compartida' ? ', empresa_id' : ''})
        VALUES (?, ?, ?, ?, ?${tipoAcceso === 'compartida' ? ', ?' : ''})
      `;
      let insertParams = [nombre, codigoBarras, descripcion, cantidad, imagen];
      if (tipoAcceso === 'compartida') {
        insertParams.push(empresa_id);
      }
  
      const [results] = await dbEmpresa.query(insertQuery, insertParams);
  
      const productId = results.insertId;
      const date = new Date();
      const fechaHora = date.toISOString().slice(0, 19).replace('T', ' ');
      const ipAddress = req.ip;
  
      const logQuery = `INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, 'insert', ?, ?)`;
      await dbEmpresa.query(logQuery, [username, productId, fechaHora, ipAddress]);


        // Si el acceso es compartido, registrar también en logs_modificaciones con empresa_id
        if (tipoAcceso === 'compartida') {
            const logQuery = `INSERT INTO logs_modificaciones (usuario, empresa_id, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, 'insert', ?, ?)`;
            await dbEmpresa.query(logQuery, [username, empresa_id, productId, fechaHora, ipAddress]);
        }
  
      console.log('Producto guardado correctamente y log registrado');
  
      res.json({
        success: true,
        message: "Producto guardado correctamente.",
        id_insertado: productId,
      });
  
    } catch (err) {
      console.error('Error en saveproduct:', err);
  
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'El código de barras ya existe',
          details: err.message 
        });
      }
  
      return res.status(500).json({ 
        error: 'Error al guardar el producto',
        details: err.message 
      });
    }
  });
  

// Exportar el router
module.exports = router;
  