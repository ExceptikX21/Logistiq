const e = require("express");

/**
 * Middleware para verificar si el usuario tiene un rol permitido.
 * @param {Array<string>} rolesPermitidos
 */
module.exports = function verificarRol(rolesPermitidos = []) {
  
  return (req, res, next) => {
    const user = req.user;
    // Dentro del endpoint antes de verificarRol
console.log("🔥 ROL DE USUARIO:", req.user.rol);
console.log("🔥 ROLES PERMITIDOS:", rolesPermitidos);


    if (!user) {
      return res.status(401).json({ error: 'No autenticado. Token inválido o ausente.' });
    }

    if (!rolesPermitidos.includes(user.rol)) {
      return res.status(403).json({ error: `Acceso denegado. Rol '${user.rol}' no autorizado., roles permitidos: ${rolesPermitidos} `, rol: user.rol });
    }

    next();
  };
}
