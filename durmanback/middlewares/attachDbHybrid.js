const { getEmpresaDb } = require('../connecThis');

const mysql = require('mysql2/promise');




// Conexión a la BD central/meta (que guarda el tipo de empresa)
const metaPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '102003',
  database: 'corexos_d'
});

const sharedPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '102003',
  database: 'Piponet'
});

async function attachDbHybrid(req, res, next) {
  try {
    const empresa_id = req.user.empresa_id;
    console.log('Middleware attachDbHybrid - empresa_id:', empresa_id);

    const [result] = await metaPool.query('SELECT * FROM empresas WHERE id = ?', [empresa_id]);

    console.log('Middleware attachDbHybrid - resultado empresa:', result);

    if (result.length === 0) {
      console.log('Empresa no encontrada en la DB meta');
      return res.status(404).json({ error: 'Empresa no ha sido encontrada' });
    }

    const empresa = result[0];
    console.log('Empresa encontrada:', empresa);

    if (empresa.tipo_acceso === 'dedicada') {
      req.db = await getEmpresaDb(empresa.id);
      req.tipo_acceso = 'dedicada';
    } else {
      req.db = sharedPool;
      req.tipo_acceso = 'compartida';
    }

    req.empresa_id = empresa_id;

    next();

  } catch (err) {
    console.error('Error en middleware attachDbHybrid:', err);
    res.status(500).json({ error: 'Error al asignar base de datos' });
  }
}


module.exports = attachDbHybrid;
