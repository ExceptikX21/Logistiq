const express = require("express");

const verifyToken = require('../middlewares/verifyToken');
const verificarRol = require('../middlewares/verificationRol');
const router = express.Router();

const verificarLicencia = require('../middlewares/verifyLicense');


const { rolesPro } = require('../helpers/roles');

router.use(verifyToken); // siempre primero verificar el token
router.use(verificarRol(rolesPro)); // aplicar verificación de rol global
router.use(verificarLicencia); // verificar licencia
router.get("/",  verifyToken , async (req, res) => {

    try {
        const empresa_id = req.user.empresa_id;
        const username = req.user.username;
        
      const { getEmpresaDb,db: masterDb, } = require("../connecThis");

        const [configuracion] = await masterDb.query('SELECT * FROM configuraciones_empresa WHERE empresa_id = ?', [empresa_id]);



        res.json({
            success: true,
            username: username, // ← Esto siempre se envía
            configuracion: configuracion.length > 0 ? configuracion[0] : null, // ← Puede ser null
            message: configuracion.length > 0 ? 'Configuration found' : 'No configuration found'
        });
        console.log(username);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            username: req.user?.username || null
        });
    }   
    
});
router.put("/color", verificarLicencia, verifyToken, verificarLicencia, async (req, res) => {
    try {
        const empresa_id = req.user.empresa_id;
        const { color_primario, color_secundario } = req.body; // Recibir ambos colores
        const { db: masterDb } = require("../connecThis");

        // Validar ambos colores
        if (color_primario && !/^#([0-9A-F]{3}){1,2}$/i.test(color_primario)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de color primario inválido. Use formato HEX (#FFFFFF)'
            });
        }

        if (color_secundario && !/^#([0-9A-F]{3}){1,2}$/i.test(color_secundario)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de color secundario inválido. Use formato HEX (#FFFFFF)'
            });
        }

        // Verificar que al menos un color fue proporcionado
        if (!color_primario && !color_secundario) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un color para actualizar'
            });
        }

        // Construir la consulta dinámicamente
        let query = 'UPDATE configuraciones_empresa SET ';
        const params = [];
        const updates = [];

        if (color_primario) {
            updates.push('color_primario = ?');
            params.push(color_primario);
        }

        if (color_secundario) {
            updates.push('color_secundario = ?');
            params.push(color_secundario);
        }

        query += updates.join(', ') + ' WHERE empresa_id = ?';
        params.push(empresa_id);

        const [result] = await masterDb.query(query, params);

        if (result.affectedRows === 0) {
            // Si no existe configuración, crea un registro (solo si ambos colores están presentes)
            if (color_primario && color_secundario) {
                await masterDb.query(
                    `INSERT INTO configuraciones_empresa 
                     (empresa_id, color_primario, color_secundario) 
                     VALUES (?, ?, ?)`,
                    [empresa_id, color_primario, color_secundario]
                );
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Configuración no existe y no se pueden crear registros parciales'
                });
            }
        }

        // Obtener la configuración actualizada para devolverla
        const [configuracion] = await masterDb.query(
            'SELECT color_primario, color_secundario FROM configuraciones_empresa WHERE empresa_id = ?',
            [empresa_id]
        );

        res.json({
            success: true,
            configuracion: configuracion[0],
            message: 'Colores actualizados correctamente'
        });

    } catch (error) {
        console.error('Error en PUT /api/configprofiles/color:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar los colores'
        });
    }
});


router.put("/logo", verificarLicencia, verifyToken, async (req, res) => {
    try {
        const empresa_id = req.user.empresa_id;
        const { logo } = req.body; // Recibir ambos colores
        const { db: masterDb } = require("../connecThis");

        // Verificar que al menos un color fue proporcionado
        if (!logo) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un logo para actualizar'
            });
        }

        // Construir la consulta dinámicamente
        let query = 'UPDATE configuraciones_empresa SET ';
        const params = [];
        const updates = [];

        updates.push('logo = ?');
        params.push(logo);

        query += updates.join(', ') + ' WHERE empresa_id = ?';
        params.push(empresa_id);

        const [result] = await masterDb.query(query, params);        


        if (result.affectedRows === 0) {
            // Si no existe configuración, crea un registro (solo si ambos colores están presentes)
            await masterDb.query(
                `INSERT INTO configuraciones_empresa 
                 (empresa_id, logo) 
                 VALUES (?, ?)`,
                [empresa_id, logo]
            );  
        }

        // Obtener la configuración actualizada para devolverla
        const [configuracion] = await masterDb.query(
            'SELECT logo FROM configuraciones_empresa WHERE empresa_id = ?',
            [empresa_id]
        );

        res.json({
            success: true,
            configuracion: configuracion[0],
            message: 'Logo actualizado correctamente'
        });

    } catch (error) {
        console.error('Error en PUT /api/configprofiles/logo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el logo'
        });
    }
}); 
router.delete('/logo', verificarLicencia, verifyToken, async (req, res) => {
    const empresa_id = req.user.empresa_id;
  
    // Conexión a la base de datos
    const { db: masterDb } = require("../connecThis");
  
    try {
      // Obtener la URL del logo actual desde la base de datos
      masterDb.query('SELECT logo_url FROM configuraciones_empresa WHERE id = ?', [empresa_id], async (err, result) => {
        if (err) {
          console.error("Error al obtener el logo de la base de datos:", err);
          return res.status(500).send('Error al obtener el logo desde la base de datos.');
        }
  
        if (!result || result.length === 0 || !result[0].logo_url) {
          console.log('No se encontró un logo asociado a la empresa.');
          return res.status(404).send('No se encontró un logo asociado a la empresa.');
        }
  
        const logoUrl = result[0].logo_url;
        const logoPath = path.join(__dirname, 'uploads', logoUrl.replace('/uploads', '').replace('/', '')); // Ajustamos la ruta
  
        // Verificar si el archivo existe antes de eliminarlo
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);  // Elimina el logo físicamente
          console.log(`Logo eliminado físicamente en: ${logoPath}`);
        } else {
          console.log(`El archivo de logo no existe en la ruta esperada: ${logoPath}`);
        }
  
        // Eliminar la URL del logo en la base de datos
        masterDb.query('UPDATE configuraciones_empresa SET logo_url = NULL WHERE id = ?', [empresa_id], (err, updateResult) => {
          if (err) {
            console.error("Error al eliminar el logo de la base de datos:", err);
            return res.status(500).send('Error al eliminar el logo de la base de datos.');
          }
  
          // Verificar si la actualización fue exitosa
          if (updateResult.affectedRows > 0) {
            console.log(`Logo eliminado de la base de datos para la empresa con ID: ${empresa_id}`);
            res.json({ success: true, message: 'Logo eliminado correctamente.' });
          } else {
            console.log('No se actualizó la base de datos.');
            res.status(500).send('Error al eliminar el logo de la base de datos.');
          }
        });
      });
    } catch (error) {
      console.error("Error al procesar la solicitud de eliminación del logo:", error);
      res.status(500).send('Error al procesar la eliminación del logo.');
    }
  });

  
router.put("/companyname", verifyToken, verificarLicencia, async (req, res) => {
    try {
        const empresa_id = req.user.empresa_id;
        const {  nombre_empresa } = req.body; // Recibir ambos colores
        const { db: masterDb } = require("../connecThis");
  
        // Verificar que ambos colores fueron proporcionados
        if (! nombre_empresa) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar un  nombre_empresa para actualizar"
            });
        }
  
        // Actualizar los colores en la base de datos
        await masterDb.query(
            "UPDATE configuraciones_empresa SET  nombre_empresa = ? WHERE empresa_id = ?",
            [ nombre_empresa, empresa_id]
        );
  
        // Devolver la configuración actualizada
        const [configuracion] = await masterDb.query(
            "SELECT  nombre_empresa FROM configuraciones_empresa WHERE empresa_id = ?",
            [empresa_id]
        );
  
        res.json({
            success: true,
            configuracion: configuracion[0],
            message: " nombre_empresa actualizado correctamente"
        });
  
    } catch (error) {
        console.error("Error en PUT /api/configprofiles/ nombre_empresa:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar el  nombre_empresa"
        });
    }
  });


  router.put("/stock", verificarLicencia, verifyToken, async (req, res) => {
    try {
        const empresa_id = req.user.empresa_id;
        const { stock_minimo_global } = req.body;
        const { db: masterDb } = require("../connecThis");

        // Validación: debe ser número entero positivo
        if (stock_minimo_global === undefined || isNaN(stock_minimo_global) || parseInt(stock_minimo_global) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un valor numérico válido para stock_minimo_global (entero ≥ 0)'
            });
        }

        // Intentar actualizar la configuración
        const [result] = await masterDb.query(
            'UPDATE configuraciones_empresa SET stock_minimo_global = ? WHERE empresa_id = ?',
            [stock_minimo_global, empresa_id]
        );

        if (result.affectedRows === 0) {
            // Si no existe, crear la configuración
            await masterDb.query(
                `INSERT INTO configuraciones_empresa (empresa_id, stock_minimo_global)
                 VALUES (?, ?)`,
                [empresa_id, stock_minimo_global]
            );
        }

        // Devolver la configuración actualizada
        const [configuracion] = await masterDb.query(
            'SELECT stock_minimo_global FROM configuraciones_empresa WHERE empresa_id = ?',
            [empresa_id]
        );

        res.json({
            success: true,
            configuracion: configuracion[0],
            message: 'Stock mínimo global actualizado correctamente'
        });

    } catch (error) {
        console.error('Error en PUT /api/configprofiles/stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el stock mínimo global'
        });
    }
});

  
  
        
module.exports = router;