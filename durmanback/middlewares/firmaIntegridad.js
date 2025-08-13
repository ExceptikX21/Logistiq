const crypto = require('crypto')

const SECRET = process.env.SECRET_FIRMA || 'clave-secreta-segura'

function generarFirma(data) {
  const stringData = JSON.stringify(ordenarObjeto(data))
  return crypto.createHmac('sha256', SECRET).update(stringData).digest('hex')
}

function verificarFirma(data, firma) {
  const firmaCalculada = generarFirma(data)
  return firma === firmaCalculada
}

// Middleware Express
function verificarFirmaMiddleware(req, res, next) {
  const { data, firma } = req.body
  if (!data || !firma) {
    return res.status(400).json({ error: 'Faltan datos o firma para validar' })
  }

  if (!verificarFirma(data, firma)) {
    return res.status(403).json({ error: 'Firma inválida' })
  }

  next()
}

// Ordena recursivamente las claves del objeto para asegurar consistencia
function ordenarObjeto(obj) {
  if (Array.isArray(obj)) {
    return obj.map(ordenarObjeto)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = ordenarObjeto(obj[key])
        return acc
      }, {})
  }
  return obj
}

module.exports = {
  generarFirma,
  verificarFirma,
  verificarFirmaMiddleware,
}
