
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {

  console.log("🕵️ Authorization header:", req.headers.authorization); // 👈 Agregado
    const token = req.headers["authorization"];
    const tokenPart = token.split(" ")[1];

    if (!tokenPart) return res.status(401).json({ error: "Token no válido" });

    

    
    if (token) {
      const { exp } = jwt.decode(tokenPart);
      const now = Date.now() / 1000;
      if (exp < now) {
        // Token vencido: redirige al login o refresca el token
        console.log("Token expirado");

        return res.status(401).json({ error: "Token expirado" });
        // logout o pedir nuevo token aquí
      }

    }
    // Verifica si el token existe
    if (!token) return res.status(403).json({ error: "Token requerido" });
  
    // Asegúrate de que el token esté en el formato correcto: "Bearer <token>"

    
    // Si no es un token "Bearer", regresa un error
    
  
    // Verifica el token usando JWT
    jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Token inválido" });
      req.user = decoded; // Añade la información del usuario decodificado a la petición
      next(); // Pasa al siguiente middleware o ruta
    });
  };



module.exports = verifyToken;
  