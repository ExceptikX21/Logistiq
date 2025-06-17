const { verify } = require('jsonwebtoken');
const { db: masterDb } = require('../connecThis'); // tu archivo de conexión a MySQL

async function verificarLicencia(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

  const tokenPart = token.split(' ')[1];
  if (!tokenPart) return res.status(403).json({ mensaje: 'Token no válido' });

  let decoded;
  try {
    decoded = verify(tokenPart, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('🚫 Token expirado (verificarLicencia)');
      return res.status(403).json({ mensaje: 'Token expirado' });
    }
    console.error('❌ Error al verificar token:', err);
    return res.status(401).json({ mensaje: 'Token inválido' });
  }

  req.user = decoded;
  const { empresa_id } = req.user;

  if (!empresa_id) {
    return res.status(400).json({ mensaje: 'ID de empresa requerido' });
  }

  try {
    const [rows] = await masterDb.execute(
      'SELECT licencia_clave, licencia_fecha_inicio, licencia_fecha_fin, licencia_estado FROM configuraciones_empresa WHERE id = ?',
      [empresa_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Licencia no encontrada para la Empresa' });
    }

    const empresa = rows[0];
    if (!empresa.licencia_clave || empresa.licencia_estado !== 'activa') {
      return res.status(403).json({
        mensaje: `Licencia inválida o no activa para la empresa con ID ${empresa_id}`,
      });
    }

    const hoy = new Date();
    const inicio = new Date(empresa.licencia_fecha_inicio);
    const fin = new Date(empresa.licencia_fecha_fin);

    if (hoy < inicio || hoy > fin) {
      return res.status(403).json({ mensaje: 'La licencia ha expirado o aún no es válida' });
    }

    next();
  } catch (error) {
    console.error('Error al verificar licencia:', error);
    return res.status(500).json({ mensaje: 'Error al verificar la licencia', error });
  }
}

module.exports = verificarLicencia;
