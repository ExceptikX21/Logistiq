/**
 * Middleware para verificar si el usuario tiene un rol permitido.
 * @param {Array<string>} rolesPermitidos
 */
module.exports = function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'No autenticado. Token inválido o ausente.' });
    }

    if (!rolesPermitidos.includes(user.rol)) {
      return res.status(403).json({ error: `Acceso denegado. Rol '${user.rol}' no autorizado.` });
    }

    next();
  };
}
