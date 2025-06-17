async function queryHybrid(req, baseSql, extraParams = []) {
    const db = req.db;
    const empresa_id = req.empresa_id;
    const tipo = req.tipo_acceso;
  
    let query = baseSql;
    let params = extraParams;
  
    // Si es compartida y no hay un WHERE ya hecho, lo agregamos
    if (tipo === 'compartida') {
      // Detectar si ya hay un WHERE en el SQL
      const hasWhere = /where\s/i.test(baseSql);
  
      if (hasWhere) {
        query = baseSql + ' AND empresa_id = ?';
      } else {
        query = baseSql + ' WHERE empresa_id = ?';
      }
  
      params = [...extraParams, empresa_id];
    }
  
    const [rows] = await db.query(query, params);
    return rows;
  }
  
  module.exports = queryHybrid;
  
  