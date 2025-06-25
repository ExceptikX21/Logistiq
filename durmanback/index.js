require("dotenv").config();
const https = require('https');
const express = require('express');
const { message } = require('statuses');
const mysql = (require('mysql2'));
const { rolesAdmin, rolesPro } = require('./helpers/roles');


const validator = require('validator');
const fs = require('fs');
const path = require('path');
const verificarRol = require('./middlewares/verificationRol');
const ventasRoutes = require('./routes/ventas');
const pedidosRoutes = require('./routes/pedidos');
const productosRoutes = require('./routes/productos');

const productosRouterEnds = require('./routes/productosEnds');
const logsRoutes = require('./routes/logsx');
const OrdersRouter = require('./routes/orders');

const almacenesRouter = require('./routes/almacenes');
const sharp = require('sharp');
const crypto = require('crypto');
const bodyParser = (require("body-parser"));
const { getEmpresaDb, db } = require('./connecThis');

const verificarLicencia = require('./middlewares/verifyLicense');

const PORT = process.env.PORT || 3000;
const socketIo = require("socket.io");
const cors = require('cors');
const { error, log } = require('console');
const ExcelJS = require('exceljs');
const proveedoresRouter = require('./routes/proveedores.js');
const configprofileRouter = require('./routes/configprofile');


const movementsInventoryRouter = require('./routes/movementsinventory');
const multer = require('multer');
const chatbotModel = require('./model/chat-model');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: 'Demasiadas solicitudes desde esta IP. Intenta más tarde.',
});


const upload = multer({ dest: 'uploads', limits: {
  fileSize: 512 * 1024 
}
 });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connect } = require("http2");
const e = require("express");

const reportsPath = path.join(__dirname, 'reports');




const app = express();

const { swaggerUi, swaggerSpec } = require('./swagger'); // <- importa tu config

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use(cors({
  origin: 'https://192.168.0.14:8080',


  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Todo por defecto solo desde tu servidor
      scriptSrc: ["'self'"], // Solo tus scripts, sin inline ni externos
      styleSrc: ["'self'", "'unsafe-inline'"], // Permitís CSS y Tailwind (requiere inline)
      imgSrc: ["'self'", "data:"], // Imágenes locales o embebidas como base64
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Si usás fuentes de Google
      connectSrc: ["'self'", "wss:", "https://192.168.0.14:443"], // APIs, websockets
      objectSrc: ["'none'"], // Bloquea Flash, Java applets, etc (legacy, mejor eliminar)
      frameAncestors: ["'none'"], // Previene que te embeban en iframes (clickjacking)
      upgradeInsecureRequests: [], // Fuerza HTTPS (opcional si ya estás en HTTPS)
    },
  })
);













app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));









// Endpoint para Actualizar productos


  



const attachDbHybrid = require('./middlewares/attachDbHybrid'); // middleware para asignar la base de datos correcta







    app.post("/register", async (req, res) => {
      const { username, password, empresa_id, email } = req.body;
      console.log("Datos recibidos:", req.body);
      if (!empresa_id) return res.status(400).json({ error: "empresa_id es requerido" });
    

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "email no es valido" });
      }

      if(!validator.isLength(password, { min: 8 })) {
      }

      if(validator.isEmpty(email)) {
        return res.status(400).json({ error: "email es requerido" });
      }

      if(validator.isEmpty(password)) {
        return res.status(400).json({ error: "password es requerido" });
      }

    if (!validator.isStrongPassword(password, {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
})) {
  return res.status(400).json({ error: "Contraseña débil. Usa mayúsculas, minúsculas, números y símbolos." });
}

      const hashedPassword = await bcrypt.hash(password, 10);
      const { getEmpresaDb } = require("./connecThis");
    
      try {
        const db = await getEmpresaDb(empresa_id);
    
        const [countRows] = await db.query(
          "SELECT COUNT(*) AS count FROM users WHERE empresa_id = ?",
          [empresa_id]
        );
    
        const isFirstUser = countRows[0].count === 0;
        const rol = isFirstUser ? 'admin' : 'usuario';
    
        await db.query(
          "INSERT INTO users ( email, username, password, empresa_id, rol) VALUES (?, ?, ?, ?, ?)",
          [email, username, hashedPassword, empresa_id, rol]
        );
    
        res.json({ message: "Usuario registrado", rol_asignado: rol });
    
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El usuario ya existe', code: err.code });
        }

        console.error("Error en registro:", err);
        res.status(500).json({ error: "Error al registrar usuario", err });
      }
    });
    


    // Inicio de sesión
    app.post("/login", async (req, res) => {
      const { username, email, password, empresa_id } = req.body;
      if (!empresa_id) return res.status(400).json({ error: "empresa_id es requerido" });
    
      const { getEmpresaDb,db: masterDb, } = require("./connecThis");


      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "email no es valido" });
      }

      if(!validator.isLength(password, { min: 8 })) {
      }

      if(validator.isEmpty(email)) {
        return res.status(400).json({ error: "email es requerido" });
      }

      if(validator.isEmpty(password)) {
        return res.status(400).json({ error: "password es requerido" });
      }


      try {
        const empresaDb = await getEmpresaDb(empresa_id);
    
        const [results] = await empresaDb.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });
    
        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Contraseña incorrecta" });
    
        const token = jwt.sign(
          { id: user.id, email: user.email, rol: user.rol, empresa_id: user.empresa_id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const [config] = await masterDb.execute("SELECT * FROM configuraciones_empresa WHERE empresa_id = ?", [user.empresa_id]);


        console.log("Token generado:", token);

        console.log("Configuración obtenida:", config);
        console.log("empresa_id from body:", empresa_id);
        console.log("user.empresa_id from DB:", user.empresa_id);
        console.log("Type of user.empresa_id:", typeof user.empresa_id);

    
        res.json({ token, user: { id: user.id, email: user.email, rol: user.rol, empresa_id: user.empresa_id, username: user.username },  configuracion: config[0]  });
      } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error al iniciar sesión", err });
      }

    });
    

    // Middleware de autenticación
    const verifyToken = (req, res, next) => {
      const token = req.headers["authorization"];


      const tokenpart = token.split(" ")[1];
      if (token) {
        const { exp } = jwt.decode(tokenpart);
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
      const tokenPart = token.split(" ")[1];
      
      // Si no es un token "Bearer", regresa un error
      if (!tokenPart) return res.status(403).json({ error: "Token no válido" });
    
      // Verifica el token usando JWT
      jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });
        req.user = decoded; // Añade la información del usuario decodificado a la petición
        next(); // Pasa al siguiente middleware o ruta
      });
    };
    
    // Ruta protegida
    app.get("/profile", verifyToken, (req, res) => {
      res.json({ message: "Perfil de usuario", user: req.user });
    });


    //Endpoint para guardar una orden

    app.post('/api/messages',verificarLicencia ,verifyToken,  async (req, res) => {
      const { sender_id, receiver_id, message } = req.body;
      try {
        const [result] = await connecThis.query(
          'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
          [sender_id, receiver_id, message]
        );
        res.status(201).json({ id: result.insertId, sender_id, receiver_id, message });
      } catch (error) {
        res.status(500).json({ error: 'Error al enviar el mensaje' });
      }
    });
    const logosFolder = path.join(__dirname, 'uploads', 'logos');
    if (!fs.existsSync(logosFolder)) {
      fs.mkdirSync(logosFolder, { recursive: true });
    }
    app.post(
      '/api/empresa/logo',
      verifyToken, verificarLicencia,
      upload.single('logo'),
      async (req, res) => {
        const empresa_id = req.user?.empresa_id;

        const { db: masterDb } = require('./connecThis');
        if (!empresa_id) {
          return res.status(401).json({ error: 'Token inválido o empresa no encontrada.' });
        }
    
        if (!req.file) {
          return res.status(400).json({ error: 'No se subió ningún archivo.' });
        }
    
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        const mimeType = req.file.mimetype;
    
        if (!allowedMimeTypes.includes(mimeType)) {
          fs.unlinkSync(req.file.path); // elimina archivo temporal
          return res.status(400).json({ error: 'Solo se permiten archivos de imagen válidos.' });
        }
    
        try {
          const image = sharp(req.file.path);
          const metadata = await image.metadata();
    
          // Validación de dimensiones
          if (metadata.width > 2000 || metadata.height > 2000) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'El logo excede las dimensiones permitidas (2000x2000).' });
          }
    
          // Formato y nombre seguro
          const newName = `${empresa_id}_logo.webp`;
          const outputDir = path.join(__dirname, 'uploads', 'logos');
          if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
          const finalPath = path.join(outputDir, newName);
    
          await image
            .resize({ width: 500, fit: 'contain', withoutEnlargement: true, background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp({ quality: 85 })
            .toFile(finalPath);
    
          fs.unlinkSync(req.file.path); // eliminar archivo temporal
    
          const logoUrl = `/uploads/logos/${newName}`;
    
          masterDb.query(
            'UPDATE configuraciones_empresa SET logo_url = ? WHERE id = ?',
            [logoUrl, empresa_id],
            (err) => {
              if (err) {
                console.error('Error al guardar en DB:', err);
                return res.status(500).json({ error: 'Error al guardar en la base de datos.' });
              }
              res.status(200).json({ success: true, logoUrl });
            }
          );
        } catch (error) {
          console.error('Error al procesar imagen:', error);
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          res.status(500).json({ error: 'Error al procesar el logo.' });
        }
      }
    );
    

    
        
    app.post('/imanigas/single', verifyToken, verificarRol(rolesAdmin), upload.single('imageProduct'), async (req, res) => {
        
      const empresa_id = req.user.empresa_id;
      if (!req.file) return res.status(404).send('No se subió ningún archivo.');
    
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
      ];
    
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).send('Solo se permiten archivos de imagen.');
      }
    
      try {
        const image = sharp(req.file.path);
        const metadata = await image.metadata();
    
        if (metadata.width > 2000 || metadata.height > 2000) {
          fs.unlinkSync(req.file.path);
          return res.status(400).send('La imagen excede las dimensiones permitidas.');
        }

        // Crear carpeta si no existe
  const companyFolder = path.join(__dirname, 'uploads', empresa_id.toString());
  if (!fs.existsSync(companyFolder)) {
    fs.mkdirSync(companyFolder, { recursive: true });
  }
    
        const newName = crypto.randomBytes(16).toString('hex') + '.webp';
        const newPath = path.join(companyFolder, newName);
        const MAX_FINAL_SIZE = 1.5 * 1024 * 1024; // 1.5 MB
    
        await image
          .resize({ width: 1000, withoutEnlargement: true })
          .webp({ quality: 80 }) // CONVERSIÓN Y OPTIMIZACIÓN A WEBP
          .toFile(newPath);
    
        const stats = fs.statSync(newPath);
        if (stats.size > MAX_FINAL_SIZE) {
          fs.unlinkSync(newPath);
          return res.status(400).send('La imagen optimizada es demasiado pesada.');
        }
    
        fs.unlinkSync(req.file.path); // Borra la original
    
        const imageUrl = `/uploads/${empresa_id}/${newName}`;
        res.json({ success: true, imageUrl });
    
      } catch (err) {
        console.error('Error procesando la imagen:', err);
        fs.unlinkSync(req.file.path);
        res.status(500).send('Error al procesar la imagen.');
      }
    });


    app.get('/api/reportes/mas-vendidos', verifyToken, async (req, res) => {


      const empresa_id = req.user.empresa_id;
      const db = await getEmpresaDb(empresa_id);
      const sql = `
        SELECT productos AS nombre, SUM(cantidad) AS total_vendidos
        FROM ventas
        GROUP BY productos
        ORDER BY total_vendidos DESC
        LIMIT 10
      `;
      const [rows] = await db.query(sql);
      res.json(rows);
    });



    app.get('/api/reportes/excel', async (req, res) => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Inventario');
    
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Producto', key: 'producto', width: 32 },
        { header: 'Cantidad', key: 'cantidad', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 20 },
      ];
    
      // Simulación de datos
      const productos = [
        req.body
      ];
    
      productos.forEach(p => worksheet.addRow(p));
    
      const filePath = path.join(__dirname, 'reporte.xlsx');
      await workbook.xlsx.writeFile(filePath);
    
      res.download(filePath, 'reporte_inventario.xlsx', () => {
        fs.unlinkSync(filePath); // borra el archivo después de enviarlo
      });
    });
    



    app.get('/users', verifyToken, async (req, res) => {
      try {
        const empresa_id = req.user.empresa_id;
        const dbEmpresa = await getEmpresaDb(empresa_id);
    
        const query = 'SELECT id, username FROM users';  // Solo de esa empresa
        const [rows] = await dbEmpresa.query(query);
    
        return res.json(rows);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).send('Error interno al obtener usuarios.');
      }
    });
    



app.get('/api/messages/:sender_id/:receiver_id', verifyToken, async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    const empresa_id = req.user.empresa_id;
    const dbEmpresa = await getEmpresaDb(empresa_id);

    const [messages] = await dbEmpresa.query(
      'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp',
      [sender_id, receiver_id, receiver_id, sender_id]
    );

    res.json(messages);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});




    // Obtener todos los proveedores

    // app.get('/api/proveedores', (req, res) => {
    //   // Convert and validate pagination parameters
    //   const page = Math.max(1, parseInt(req.query.page) || 1);
    //   const limit = Math.max(1, parseInt(req.query.limit) || 10);
    //   const offset = (page - 1) * limit;
    
    //   // Base query with proper parameter formatting
    //   const query = `
    //     SELECT * FROM proveedores 
    //     ORDER BY id 
    //     LIMIT ? OFFSET ?
    //   `;
    
    //   const countQuery = 'SELECT COUNT(*) as total FROM proveedores';
    
    //   // Execute count query first
    //   connecThis.query(countQuery, (err, [countResult]) => {
    //     if (err) {
    //       console.error('Error counting suppliers:', err);
    //       return res.status(500).json({ error: 'Error fetching suppliers' });
    //     }
    
    //     // Execute main query with numeric parameters
    //     connecThis.query(query, [Number(limit), Number(offset)], (err, results) => {
    //       if (err) {
    //         console.error('Error fetching suppliers:', err);
    //         return res.status(500).json({ error: 'Error fetching suppliers' });
    //       }
    
    //       // Return paginated results
    //       res.json({
    //         suppliers: results,
    //         total: countResult.total,
    //         page: page,
    //         limit: limit,
    //         totalPages: Math.ceil(countResult.total / limit)
    //       });
    //     });
    //   });
    // });
  
    // // Crear nuevo proveedor
    // app.post('/api/proveedores', (req, res) => {
    //   const { nombre, contacto, telefono, email, direccion } = req.body;
    //   const query = 'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)';
    //   connecThis.query(query, [nombre, contacto, telefono, email, direccion], (err, result) => {
    //     if (err) {
    //       console.error('Error al crear el proveedor:', err);
    //       res.status(500).send('Error al crear el proveedor');
    //       return;
    //     }
    //     // Obtener el proveedor recién creado
    //     connecThis.query('SELECT * FROM proveedores WHERE id = ?', [result.insertId], (err, results) => {
    //       if (err) {
    //         console.error('Error al obtener el proveedor creado:', err);
    //         res.status(500).send('Error al obtener el proveedor creado');
    //         return;
    //       }
    //       res.json(results[0]);
    //     });
    //   });
    // });

    // // Actualizar proveedor
    // app.put('/api/proveedores/:id', verifyToken, verificarRol(['admin']), (req, res) => {
    //   const { id } = req.params;
    //   const { nombre, contacto, telefono, email, direccion } = req.body;
    //   const query = 'UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?';
    //   connecThis.query(query, [nombre, contacto, telefono, email, direccion, id], (err, result) => {
    //     if (err) {
    //       console.error('Error al actualizar el proveedor:', err);
    //       res.status(500).send('Error al actualizar el proveedor');
    //       return;
    //     }
    //     if (result.affectedRows === 0) {
    //       res.status(404).send('Proveedor no encontrado');
    //       return;
    //     }
    //     res.json({ message: 'Proveedor actualizado correctamente' });
    //   });
    // });

    // // Eliminar proveedor
    // app.delete('/api/proveedores/:id', verifyToken,verificarRol(['admin']),(req, res) => {
    //   const { id } = req.params;
    //   const query = 'DELETE FROM proveedores WHERE id = ?';
    //   connecThis.query(query, [id], (err, result) => {
    //     if (err) {
    //       console.error('Error al eliminar el proveedor:', err);
    //       res.status(500).send('Error al eliminar el proveedor');
    //       return;
    //     }
    //     if (result.affectedRows === 0) {
    //       res.status(404).send('Proveedor no encontrado');
    //       return;
    //     }
    //     res.json({ message: 'Proveedor eliminado correctamente' });
    //   });
    // });

    // app.get('/api/proveedores/search', (req, res) => {
    //   const { query, page = 1, limit = 10 } = req.query;
      
    //   if (!query) {
    //     return res.status(400).json({ error: 'Query parameter is required' });
    //   }

    //   const offset = (page - 1) * limit;

    //   const searchQuery = `
    //     SELECT * FROM proveedores 
    //     WHERE nombre = ? 
    //     OR contacto = ? 
    //     OR telefono = ? 
    //     OR email = ?
    //     ORDER BY id 
    //     LIMIT ? OFFSET ?
    //   `;

    //   const countQuery = `
    //     SELECT COUNT(*) as total FROM proveedores 
    //     WHERE nombre = ? 
    //     OR contacto = ? 
    //     OR telefono = ? 
    //     OR email = ?
    //   `;

    //   connecThis.query(countQuery, [query, query, query, query], (err, [countResult]) => {
    //     if (err) {
    //       console.error('Error counting suppliers:', err);
    //       return res.status(500).json({ error: 'Error searching suppliers' });
    //     }

    //     connecThis.query(searchQuery, [query, query, query, query, limit, offset], (err, results) => {
    //       if (err) {
    //         console.error('Error searching suppliers:', err);
    //         return res.status(500).json({ error: 'Error searching suppliers' });
    //       }

    //       res.json({
    //         suppliers: results,
    //         total: countResult.total,
    //         page: parseInt(page),
    //         limit: parseInt(limit),
    //         totalPages: Math.ceil(countResult.total / limit)
    //       });
    //     });
    //   });
    // });


    let model;
    (async () => {
      model = await chatbotModel.createModel();
      await chatbotModel.trainModel(model);
      console.log('Modelo cargado y entrenado');
    })();
    
    // Servir archivos estáticos desde el directorio 'reports'
    app.use('/reports', express.static(path.join(__dirname, 'reports')));
    if (!fs.existsSync(reportsPath)) {
      fs.mkdirSync(reportsPath, { recursive: true });
  }



  // app.put('/orders/:id', verifyToken, verificarLicencia, verificarRol(['admin']), async (req, res) => {
  //   const empresa_id = req.user.empresa_id;
  //   const orderId = req.params.id;
  //   const { date, supplier, details, status, total, updated_at } = req.body;
  //   const username = req.user.username;
  
  //   if (!date || !supplier || !status || !updated_at) {
  //     return res.status(400).send('Los campos (date, supplier, status, updated_at) son requeridos');
  //   }
  
  //   try {
  //     const dbEmpresa = await getEmpresaDb(empresa_id);
  //     const newUpdatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  //     const [result] = await dbEmpresa.execute(
  //       `UPDATE orders 
  //        SET date = ?, supplier = ?, details = ?, status = ?, total = ?, updated_at = ?
  //        WHERE id = ? AND updated_at = ?`,
  //       [date, supplier, details, status, total, newUpdatedAt, orderId, updated_at]
  //     );
  
  //     if (result.affectedRows === 0) {
  //       return res.status(409).send('La orden fue modificada por otro usuario');
  //     }
  
  //     // Registrar log
  //     const now = new Date();
  //     const fechaHora = now.toISOString().slice(0, 19).replace('T', ' ');
  //     const ip = req.ip;
  
  //     await dbEmpresa.execute(
  //       'INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)',
  //       [username, orderId, 'update', fechaHora, ip]
  //     );
  
  //     return res.json({ 
  //       id: orderId, 
  //       date, 
  //       supplier, 
  //       details, 
  //       status, 
  //       total, 
  //       updated_at: newUpdatedAt 
  //     });
  //   } catch (err) {
  //     console.error('Error al actualizar la orden:', err);
  //     return res.status(500).send('Error al actualizar la orden');
  //   }
  // });
  
  
  // app.delete('/orders/:id', verifyToken, verificarLicencia , verificarRol(['admin']), async (req, res) => {
  //   const empresa_id = req.user.empresa_id;
  //   const ordenId = req.params.id;
  
  //   try {
  //     const dbEmpresa = await getEmpresaDb(empresa_id);
  
  //     const [result] = await dbEmpresa.execute('DELETE FROM orders WHERE id = ?', [ordenId]);
  
  //     if (result.affectedRows === 0) {
  //       return res.status(404).send('Orden no encontrada');
  //     }
  
  //     return res.json({ id: ordenId });
  //   } catch (err) {
  //     console.error('Error al eliminar la orden:', err);
  //     return res.status(500).send('Error al eliminar la orden');
  //   }
  // });
  
  // app.get('/orders/:orderNumber',  verifyToken, async (req, res) => {
  //   const empresa_id = req.user.empresa_id;
  //   const orderNumber = req.params.orderNumber;
  
  //   try {
  //     const dbEmpresa = await getEmpresaDb(empresa_id);
  
  //     const [rows] = await dbEmpresa.execute(
  //       'SELECT * FROM orders WHERE orderNumber = ?',
  //       [orderNumber]
  //     );
  
  //     if (rows.length === 0) {
  //       return res.status(404).send('Orden no encontrada');
  //     }
  
  //     return res.json(rows[0]);
  //   } catch (err) {
  //     console.error('Error al buscar la orden:', err);
  //     return res.status(500).send('Error al buscar la orden');
  //   }
  // });
  // app.get('/api/orders', verificarLicencia,verifyToken, async (req, res) => {
    
  //   const empresa_id = req.user.empresa_id;
  
  //   try {
  //     const dbEmpresa = await getEmpresaDb(empresa_id);
  
  //     const [orders] = await dbEmpresa.execute('SELECT * FROM orders');
  
  //     return res.json(orders);
      
  //   } catch (err) {


  //     console.error('Error al obtener las órdenes:', err);
  //     return res.status(500).json({ error: 'Error al obtener las órdenes' });
  //   }
  // });
  
  // app.post('/api/orders', verificarLicencia,verifyToken, verificarRol(['admin']), async (req, res) => {
  //   const empresa_id = req.user.empresa_id;
  //   const { orderNumber, date, supplier, details, status, total } = req.body;
  
  //   if (!orderNumber || !date || !supplier || !status || !total) {
  //     return res.status(400).json({ error: 'Faltan campos requeridos' });
  //   }
  
  //   try {
  //     const dbEmpresa = await getEmpresaDb(empresa_id);
  
  //     const query = `
  //       INSERT INTO orders (orderNumber, date, supplier, details, status, total)
  //       VALUES (?, ?, ?, ?, ?, ?)
  //     `;
  
  //     const [result] = await dbEmpresa.execute(query, [orderNumber, date, supplier, details, status, total]);
  
  //     return res.status(201).json({ id: result.insertId, orderNumber, date, supplier, details, status, total });
  //   } catch (err) {
  //     console.error('Error al crear la orden:', err);
  //     return res.status(500).json({ error: 'Error al crear la orden' });
  //   }
  // });





  
// // GET /api/almacenes
// app.get('/api/almacenes', verifyToken, verificarRol(['admin']), async (req, res) => {
//   try {
//     const empresaId = req.user.empresa_id;

//     const query = `
//       SELECT 
//         a.id AS id,
//         a.nombre AS nombre,
//         a.x, a.y, a.width, a.height, a.path, a.tipo,
//         COALESCE(SUM(sa.cantidad), 0) AS totalStock,
//         COALESCE(
//           JSON_ARRAYAGG(
//             JSON_OBJECT(
//               'name', p.nombre,
//               'quantity', sa.cantidad,
//               'stock_id', sa.id
//             )
//           ), 
//           JSON_ARRAY()
//         ) AS productos
//       FROM almacenes a
//       LEFT JOIN stock_almacen sa ON sa.almacen_id = a.id
//       LEFT JOIN productos p ON sa.producto_id = p.id
//       WHERE a.empresa_id = ?
//       GROUP BY a.id
//     `;

//     const dbEmpresa = await getEmpresaDb(empresaId);
//     if (!dbEmpresa) {
//       return res.status(500).json({ error: 'No se pudo conectar a la base de datos de la empresa' });
//     }

//     const [results] = await dbEmpresa.query(query, [empresaId]);

//     const almacenes = results.map(row => {
//       const stockLevel = row.totalStock >= 200
//         ? 'high'
//         : row.totalStock >= 100
//           ? 'medium'
//           : 'low';

//       return {
//         ...row,
//         stockLevel,
//         productos: row.productos || []
//       };
//     });

//     res.json(almacenes);
//   } catch (err) {
//     console.error('Error al obtener almacenes:', err);
//     res.status(500).json({
//       error: 'Error al obtener los almacenes',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });


// // POST /api/almacenes
// app.post('/api/almacenes', verifyToken, verificarLicencia, verificarRol(['admin']) ,async (req, res) => {
//   const { nombre, x, y, width, height, tipo } = req.body;
//   const empresaId = req.user.empresa_id;

//   if (!nombre || x == null || y == null || width == null || height == null || !tipo) {
//     return res.status(400).json({ error: "Faltan datos obligatorios." });
//   }

//   const query = `
//     INSERT INTO almacenes (nombre, x, y, width, height, tipo, empresa_id)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   const dbEmpresa = await getEmpresaDb(empresaId);
//   if (!dbEmpresa) {
//     return res.status(500).json({ error: 'Error al conectar con la base de datos de la empresa' });
//   }

//   try {
//     await dbEmpresa.query(query, [nombre, x, y, width, height, tipo, empresaId]);
//     res.json({ success: true, message: "Almacén registrado correctamente." });
//   } catch (err) {
//     console.error('Error guardando el almacén:', err);
//     res.status(500).json({ error: 'Error al guardar el almacén.' });
//   }
// });

// // DELETE /api/stock_almacen/:id
// app.delete('/api/stock_almacen/:id', verificarLicencia , verificarRol(['admin']),verifyToken, async (req, res) => {
//   const id = req.params.id;
//   const empresaId = req.user.empresa_id;

//   const dbEmpresa = await getEmpresaDb(empresaId);
//   if (!dbEmpresa) {
//     return res.status(500).json({ error: 'Error al conectar con la base de datos de la empresa' });
//   }

//   try {
//     const [result] = await dbEmpresa.query(
//       'DELETE FROM stock_almacen WHERE id = ?',
//       [id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Producto no encontrado en el almacén' });
//     }

//     res.json({ message: 'Producto eliminado correctamente del almacén' });
//   } catch (err) {
//     console.error('Error al eliminar producto del almacén:', err);
//     res.status(500).json({ error: 'Error al eliminar producto del almacén' });
//   }
// });


// // DELETE /api/almacenes/:id
// app.delete('/api/almacenes/:id', verifyToken, verificarLicencia ,  verificarRol(['admin']), async (req, res) => {
//   const id = req.params.id;
//   const empresaId = req.user.empresa_id;

//   const query = 'DELETE FROM almacenes WHERE id = ? AND empresa_id = ?';

//   const dbEmpresa = await getEmpresaDb(empresaId);
//   if (!dbEmpresa) {
//     return res.status(500).json({ error: 'Error al conectar con la base de datos de la empresa' });
//   }

//   try {
//     const [result] = await dbEmpresa.query(query, [id, empresaId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Almacén no encontrado o no autorizado' });
//     }

//     res.json({ message: 'Almacén eliminado correctamente' });
//   } catch (err) {
//     console.error('Error al eliminar almacén:', err);
//     res.status(500).json({ error: 'Error al eliminar almacén' });
//   }
// });

// // Crear stock en almacén
// app.post('/api/stock_almacen', verifyToken, verificarLicencia,  verificarRol(['admin']), async (req, res) => {
//   const { almacen_id, producto_id, cantidad } = req.body;
//   const empresaId = req.user.empresa_id;

//   if (!almacen_id || !producto_id || !cantidad) {
//     return res.status(400).json({ error: "Faltan datos obligatorios." });
//   }

//   const dbEmpresa = await getEmpresaDb(empresaId);
//   if (!dbEmpresa) {
//     return res.status(500).json({ error: 'Error al conectar con la base de datos de la empresa' });
//   }

//   const query = `
//     INSERT INTO stock_almacen (almacen_id, producto_id, cantidad)
//     VALUES (?, ?, ?)
//   `;

//   try {
//     const [results] = await dbEmpresa.query(query, [almacen_id, producto_id, cantidad]);
//     res.json({ success: true, message: "Producto registrado en almacén correctamente." });
//   } catch (err) {

//     if(err.code === 'ER_DUP_ENTRY') {
//       return res.status(400).json({ error: 'El producto ya existe en el almacén.' });
//     }
//     if(err.code === 'ER_NO_REFERENCED_ROW_2') {
//       return res.status(404).json({ error: 'El producto no existe en el inventario.' });
//     }
//     console.error('Error al guardar en stock_almacen:', err);
//     res.status(500).json({ error: 'Error al guardar el stock en el almacén.' });
//   }
// });

  
  
//   app.get('/productos',  verifyToken, async (req, res) => {
//     const empresa_id = req.user.empresa_id;  // Suponiendo que tienes este valor en el usuario autenticado
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const nombre = req.query.nombre;

//     const all = req.query.all === 'true'; // import
//     let whereClause = '';
//     let queryParams = [];
    


//     // Conexión a la base de datos de la empresa
//     let dbEmpresa;
//     try {
//         dbEmpresa = await getEmpresaDb(empresa_id);
//     } catch (err) {
//         console.error('Error al conectar con la base de datos de la empresa:', err);
//         return res.status(500).send('No se pudo conectar con la base de datos de la empresa.');
//     }

//     if (nombre) {
//       whereClause = 'WHERE nombre LIKE ?';
//       queryParams.push(`%${nombre}%`);
//   }
//     // Query para obtener el total de productos
//     const countQuery = 'SELECT COUNT(*) as total FROM productos';
    
//     // Query para obtener la suma total de unidades (stock)
//     const sumQuery = 'SELECT SUM(cantidad) as totalUnidades FROM productos';

//     const querySugestion = `SELECT * FROM productos ${whereClause}`;
 
//     // Query para obtener los productos paginados
//     let mainQuery = `SELECT * FROM productos ${whereClause}`;
//     if (!all) {
//         mainQuery += ` LIMIT ? OFFSET ?`;
//         queryParams.push(limit, offset);
//     }




//     // Definir el umbral para la alerta
//     const alertThreshold = 700;  // Umbral para activar la alerta (por ejemplo, 700 unidades)

//     // Lógica de IA para analizar el stock
//     const analyzeStockWithAI = (totalUnidades) => {
//         // La IA puede aquí aplicar un análisis más complejo
//         if (totalUnidades < alertThreshold) {
//             // Si el stock es bajo, la IA puede sugerir alguna acción (como restock)
//             return "Alerta: Tu inventario de productos está casi agotado. Puede que quieras revisar las opciones de reposición.";
//         }

//         const saludoArray = [
//           "¡Hola! Todo en orden con el stock. 😊",
//           "¡Buenas noticias! El inventario está en control.",
//           "¡Hola! El stock está en niveles óptimos.",
//           "¡Hola! Todo está funcionando bien con el inventario.",
//           "¡Hola! El sistema no detecta problemas de stock por ahora.",
//           "¡Hey! Todo se ve bien en el almacén.",
//           "¡Hola! Bien hecho, el stock se mantiene estable.",
//           "¡Hola! Parece que todo está fluyendo bien con el inventario.",
//           "¡Hola! Tu inventario está perfectamente equilibrado.",
//           "¡Saludos! El sistema muestra niveles saludables de stock."
//         ];
        
//         const saludo = saludoArray[Math.floor(Math.random() * saludoArray.length)];
//         // Si no hay alerta, la IA puede sugerir acciones de optimización o reporte
//         return saludo  +   `\n  El stock se encuentra dentro de los límites normales.`
//     };

//     // Primero obtener el total de productos y unidades
//     try {
//         const [countResult] = await dbEmpresa.query(countQuery);
//         const totalProducts = countResult[0].total;

//         const [sumResult] = await dbEmpresa.query(sumQuery);
//         const totalUnidades = sumResult[0].totalUnidades || 0; // Si no hay productos, devuelve 0

//         // Análisis de stock con la IA
//         const aiAlertMessage = analyzeStockWithAI(totalUnidades);
//         const inicio = Date.now();

//         // Luego obtener los productos de la página actual
       
//         const [results] = await dbEmpresa.query(mainQuery, queryParams);
//         const duracion = Date.now() - inicio;
//         console.log(`⏱️ Consulta productos: ${duracion}ms`);

//         // Devuelve los productos con información de paginación, total de unidades y la alerta de la IA
//         res.json({
//             products: results,
//             pagination: {
//                 page,
//                 limit,
//                 totalProducts,
//                 totalUnidades,
//                 nombre
//             },
//             alert: aiAlertMessage,
//         });
//     } catch (err) {
//         console.error('Error al obtener los productos:', err);
//         res.status(500).send('Error al obtener los productos.');
//     }
// });
// app.get('/products/:id', verifyToken, async (req, res) => {
//   const empresa_id = req.user.empresa_id;
//   const productId = req.params.id;
//   const query = 'SELECT * FROM productos WHERE id = ?';

//   let dbEmpresa;
//   try {
//       dbEmpresa = await getEmpresaDb(empresa_id);
//   } catch (err) {
//       console.error('Error al conectar con la base de datos de la empresa:', err);
//       return res.status(500).send('No se pudo conectar con la base de datos de la empresa.');
//   }

//   try {
//       const [rows] = await dbEmpresa.query(query, [productId]);

//       if (rows.length === 0) {
//           return res.status(404).send('Producto no encontrado');
//       }

//       return res.json(rows[0]);
//   } catch (err) {
//       console.error('Error al buscar el producto:', err);
//       return res.status(500).send('Error al buscar el producto.');
//   }
// });

// app.delete('/products/:id', verifyToken, verificarLicencia, verificarRol(['admin']), async (req, res) => {
//   const empresa_id = req.user.empresa_id;
//   const productId = req.params.id;
//   const username = req.user.username;
//   const queryDelete = 'DELETE FROM productos WHERE id = ?';
//   const logQuery = `INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)`;

//   let dbEmpresa;
//   try {
//     dbEmpresa = await getEmpresaDb(empresa_id);
//   } catch (err) {
//     console.error('Error al conectar con la base de datos de la empresa:', err);
//     return res.status(500).send('No se pudo conectar con la base de datos de la empresa.');
//   }

//   try {
//     const [result] = await dbEmpresa.query(queryDelete, [productId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).send('Producto no encontrado');
//     }

//     // Insertar en logs_modificaciones
//     const date = new Date();
//     const fechaHora = date.toISOString().slice(0, 19).replace('T', ' '); // formato 'YYYY-MM-DD HH:MM:SS'
//     const ipAddress = req.ip;

//     await dbEmpresa.query(logQuery, [username, productId, 'delete', fechaHora, ipAddress]);

//     console.log('Producto eliminado correctamente y log registrado');

//     return res.json({ id: productId });
//   } catch (err) {
//     console.error('Error al eliminar el producto:', err);
//     return res.status(500).send('Error al eliminar el producto');
//   }
// });


// app.put('/products/:id', verificarLicencia,verifyToken, verificarRol(['admin']), async (req, res) => {
//   const empresa_id = req.user.empresa_id;
//   const productId = req.params.id;
//   const { nombre, descripcion, cantidad, imagen, updated_at } = req.body;
//   const username = req.user.username;

//   const currentUpdatedAt = updated_at;
//   if (!nombre || !descripcion || cantidad === undefined) {
//     return res.status(400).send('Todos los campos (nombre, descripcion, cantidad) son requeridos');
//   }

//   // 1. Primero obtenemos el producto actual
//   const getQuery = 'SELECT updated_at FROM productos WHERE id = ?';
//   const updateQuery = 'UPDATE productos SET nombre = ?, descripcion = ?, cantidad = ?, imagen = ?, updated_at = ? WHERE id = ? AND updated_at = ?';
//   const logQuery = 'INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)';

//   let dbEmpresa;
//   try {
//     dbEmpresa = await getEmpresaDb(empresa_id);
    
//     // Obtener fecha actual del producto
//     if (!updated_at) {
//       return res.status(400).send('Se requiere el campo updated_at');
//     }
//     const currentUpdatedAt = updated_at;
    

  
//     const newUpdatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

//     // Actualizar el producto
//     const [result] = await dbEmpresa.query(updateQuery, [
//       nombre, 
//       descripcion, 
//       cantidad, 
//       imagen,
//       newUpdatedAt,
//       productId,
//       currentUpdatedAt

//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(409).send('El producto fue modificado por otro usuario');
//     }

//     // Registrar log
//     const ipAddress = req.ip;
//     await dbEmpresa.query(logQuery, [
//       username, 
//       productId, 
//       'update', 
//       newUpdatedAt, 
//       ipAddress
//     ]);

//     return res.json({ 
//       id: productId, 
//       nombre, 
//       descripcion, 
//       cantidad, 
//       imagen,
//       updated_at: newUpdatedAt 
//     });
    
//   } catch (err) {
//     console.error('Error:', err);
//     return res.status(500).send('Error al actualizar el producto');
//   }
// });
// // Buscar producto por código de barras





// /**
//  * @swagger
//  * tags:
//  *   name: productos
//  *   description: Buscar productos por código de barras
//  */

// /**
//  * @swagger
//  * /products/barcode/{codigo}:
//  *   get:
//  *     summary: Buscar producto por código de barras
//  *     parameters:
//  *       - in: path
//  *         name: codigo
//  *         required: true
//  *         schema:
//  *           type: string
//  *         example: "7501031311309"  # Ejemplo real
//  *       - in: header
//  *         required: true
//  *         schema:
//  *           type: string
//  *         example: "1"
//  *     responses:
//  *       200:
//  *         description: Producto encontrado
//  *         content:
//  *           application/json:
//  *             example:
//  *               id: 1
//  *               nombre: "Leche Entera 1L"
//  *               codigoBarras: "7501031311309"
//  *               precio: 25.50
//  *       404:
//  *         description: Producto no encontrado
//  *       500:
//  *         description: Error del servidor
// */


// app.get('/api/products/barcode/:codigo', verifyToken, async (req, res) => {
//   const empresa_id = req.user.empresa_id;
//   const codigo = req.params.codigo;

//   try {
//     const dbEmpresa = await getEmpresaDb(empresa_id);

//     const query = 'SELECT * FROM productos WHERE codigoBarras = ?';
//     const [rows] = await dbEmpresa.query(query, [codigo]);

//     if (rows.length === 0) {
//       return res.status(404).json({ mensaje: 'Producto no encontrado' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error al buscar producto por código de barras:', error);
//     res.status(500).json({ mensaje: 'Error en el servidor' });
//   }
// });


// app.post('/api/saveproduct', verificarLicencia ,verifyToken, async (req, res) => {
//   const empresa_id = req.user.empresa_id;
  
//   const username = req.user.username;
//   const { nombre, codigoBarras, descripcion, cantidad, imagen } = req.body;

//   // Validaciones
//   if (!nombre || !codigoBarras || !descripcion || cantidad == null) {
//     return res.status(400).json({ error: "Faltan datos obligatorios." });
//   }

//   if (isNaN(cantidad)) {
//     return res.status(400).json({ error: "El campo 'cantidad' debe ser un número." });
//   }

//   try {
//     // Conectar a la base de datos de la empresa
//     const dbEmpresa = await getEmpresaDb(empresa_id);
//   const logQuery = `INSERT INTO logs_modificaciones (usuario, producto_id, accion, fecha_hora, ip) VALUES (?, ?, ?, ?, ?)`;

    
//     // Verificar si el código de barras ya existe en ESTA base de datos
//     const [existing] = await dbEmpresa.query(
//       'SELECT id FROM productos WHERE codigoBarras = ?', 
//       [codigoBarras]
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({ error: 'El código de barras ya existe en esta empresa' });
//     }

//     // Insertar el producto
//     const [results] = await dbEmpresa.query(
//       `INSERT INTO productos (nombre, codigoBarras, descripcion, cantidad, imagen)
//        VALUES (?, ?, ?, ?, ?)`,
//       [nombre, codigoBarras, descripcion, cantidad, imagen]
//     );

//     const productId = results.insertId;

//     const date = new Date();
//     const formattedDate = date.toISOString().slice(0, 10);
//     const formattedTime = date.toLocaleTimeString();
//     const fechaHora = `${formattedDate} ${formattedTime}`;
//     const ipAddress = req.ip;

//     await dbEmpresa.query(logQuery, [username, productId, 'insert', fechaHora, ipAddress]);

//     console.log('Producto actualizado correctamente y log registrado');

    

//     res.json({
//       success: true,
//       message: "Producto guardado correctamente.",
//       id_insertado: results.insertId,
//     });

//   } catch (err) {
//     console.error('Error en saveproduct:', err);
    
//     // Manejo específico para error de duplicado
//     if (err.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({ 
//         error: 'El código de barras ya existe',
//         details: err.message 
//       });
//     }
    
//     return res.status(500).json({ 
//       error: 'Error al guardar el producto',
//       details: err.message 
//     });
//   }
// });


  
  
    
    
    
    
// Ruta combinada para obtener respuestas
app.post('/api/chat', verificarLicencia ,verifyToken, verificarRol(rolesPro), async (req, res) => {
  try {
    console.log("📥 Datos recibidos en el backend:", req.body);

    const empresa_id = req.user.empresa_id;
    const db = await getEmpresaDb(empresa_id); // ← instancia correcta para esa empresa

    let { input, data } = req.body;

    if (input === "SUBMIT_PROVEEDOR_DATA" && data) {
      if (typeof data === 'string') {
        const parts = data.split(",").map(p => p.trim());
        if (parts.length < 4) {
          return res.json({ response: "Formato incorrecto. Debes ingresar: Nombre, Contacto, Teléfono, Email" });
        }
        data = {
          nombre: parts[0],
          contacto: parts[1],
          telefono: parts[2],
          email: parts[3]
        };
      } else if (typeof data === 'object') {
        const requiredFields = ['nombre', 'contacto', 'telefono', 'email'];
        const missingFields = requiredFields.filter(field => !(field in data));
        if (missingFields.length > 0) {
          return res.json({ response: `Faltan campos requeridos: ${missingFields.join(', ')}` });
        }
      }
    }

    if (input === "SUBMIT_PRODUCTO_DATA" && data) {
      if (typeof data === 'string') {
        const parts = data.split(",").map(p => p.trim());
        if (parts.length < 5) {
          return res.json({ response: "Formato incorrecto. Debes ingresar: Nombre, Descripción, Precio, Cantidad, Código de Barras" });
        }
        data = {
          nombre: parts[0],
          descripcion: parts[1],
          precio: parseFloat(parts[2]),
          cantidad: parseInt(parts[3]),
          codigoBarras: parts[4]
        };
      }
    }

    // 🔥 Aquí pasas la instancia de base de datos directamente al modelo
    const response = await chatbotModel.predictResponse(model, input, data, db);

    console.log("📤 Respuesta generada por el chatbot:", response);
    res.json({ response });

  } catch (error) {
    console.error("❌ Error en el endpoint de chat:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.use('/api/productos', verifyToken, productosRoutes);

app.use('/api/ventas', ventasRoutes);

app.use(productosRouterEnds);
app.use(OrdersRouter)
app.use(almacenesRouter);



app.use('/api/proveedores', proveedoresRouter);

app.use('/api/movimientos', movementsInventoryRouter ); 

app.use('/api/pedidos-automaticos',  pedidosRoutes);

app.use('/api/configprofiles',   configprofileRouter);

// app.get('/logxas', verifyToken, async (req, res) => {
//   try {
//     const empresa_id = req.user.empresa_id;
//     let dbEmpresa;

//     try {
//       dbEmpresa = await getEmpresaDb(empresa_id);
//     } catch (err) {
//       console.error('Error al conectar con la base de datos de la empresa:', err);
//       return res.status(500).send('No se pudo conectar con la base de datos de la empresa.');
//     }

//     try {
//       const query = 'SELECT * FROM logs_modificaciones ORDER BY fecha_hora DESC LIMIT 10';
//       const [rows] = await dbEmpresa.query(query);
      
//       if (rows.length === 0) {
//         return res.status(404).send('No se encontraron registros de logs.');
//       }

//       return res.json(rows);
//     } catch (error) {
//       console.error('Error al ejecutar la consulta:', error);
//       return res.status(500).send('Error al obtener los logs de modificaciones.');
//     }
    
//   } catch (err) {
//     console.error('Error general en el endpoint:', err);
//     return res.status(500).send('Error interno del servidor.');
//   }
// });
app.use(logsRoutes)


app.get('/export-excel', verificarRol(rolesAdmin), verifyToken, attachDbHybrid, async (req, res) => {
  try {
    const db = req.db;
    const empresa_id = req.empresa_id; // viene desde attachDbHybrid
    const tipo_acceso = req.tipo_acceso; // 'compartida' o 'dedicada'

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    // Logo
    const logoPath = path.join(__dirname, '../durman/src/assets/logo.svg');
    if (fs.existsSync(logoPath)) {
      const logoId = workbook.addImage({
        filename: logoPath,
        extension: 'svg',
      });

      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 150, height: 50 }
      });
    }

    // Columnas
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Código de Barras', key: 'codigoBarras', width: 25 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
    ];

    // Estilos del encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2E80CC' }
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      cell.alignment = { horizontal: 'center' };
    });

    // 📌 Consulta según tipo de acceso
    let query = 'SELECT id, nombre, codigoBarras, descripcion, cantidad FROM productos';
    let params = [];

    if (tipo_acceso === 'compartida') {
      query += ' WHERE empresa_id = ?';
      params.push(empresa_id);
    }

    const [rows] = await db.execute(query, params);

    // Agregar datos con colores alternados
    rows.forEach((row, index) => {
      const newRow = worksheet.addRow(row);
      const fillColor = index % 2 === 0 ? 'ADD8E6' : '87CEEB';
      newRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
      });
    });

    // Descargar archivo
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_productos.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generando Excel:', error);
    res.status(500).json({
      error: 'Error al generar el reporte',
      details: error.message
    });
  }
});


const PDFDocument = require('pdfkit');

app.get('/export-pdf', verificarRol(rolesAdmin), verifyToken, attachDbHybrid, async (req, res) => {
  try {
    const db = req.db;
    const empresa_id = req.empresa_id;
    const tipo_acceso = req.tipo_acceso;

    let query = 'SELECT id, nombre, codigoBarras, descripcion, cantidad FROM productos';
    let params = [];

    if (tipo_acceso === 'compartida') {
      query += ' WHERE empresa_id = ?';
      params.push(empresa_id);
    }

    const [productos] = await db.execute(query, params);

    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      info: {
        Title: 'Reporte de Productos',
        Author: 'Sistema de Inventario',
        CreationDate: new Date()
      }
    });

    res.setHeader('Content-Disposition', 'attachment; filename="reporte_productos.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Cabecera
    const logoPath = path.join(__dirname, './assets/logo-min.png');
    doc.fontSize(9).fillColor('#555').text(`Generado el: ${new Date().toLocaleString()}`, { align: 'right' });


    console.log(logoPath);
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, {
        fit: [120, 100],  // Máximo tamaño (ancho, alto)
        align: 'center',
        valign: 'top'
      });
      doc.y += 80; // evitar moveDown
    }
     else {
      doc.moveDown(4);
    }


    
    doc.fontSize(18).font('Helvetica-Bold').text('Reporte de Productos', { align: 'center' });
    doc.moveDown();
    doc.moveDown();

    const headers = ['ID', 'Nombre', 'Código', 'Descripción', 'Cantidad'];
    const columnWidths = [40, 130, 90, 180, 60];
    const startX = 40;
    let y = doc.y;

    // Función para dibujar una fila
    const drawRow = (row, isHeader = false) => {
      const cellPadding = 4;
      const lineHeight = 12;

      // Calcular altura máxima de esta fila
      const heights = row.map((text, i) =>
        doc.heightOfString(String(text), {
          width: columnWidths[i] - cellPadding * 2,
          align: 'left'
        })
      );
      const rowHeight = Math.max(...heights) + cellPadding * 2;

      // Salto de página si se pasa
      if (y + rowHeight > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }

      row.forEach((text, i) => {
        const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, y, columnWidths[i], rowHeight).stroke('#dddddd');

        doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(10)
          .fillColor(isHeader ? '#000' : '#333')
          .text(String(text), x + cellPadding, y + cellPadding, {
            width: columnWidths[i] - cellPadding * 2,
            align: 'left'
          });
      });

      y += rowHeight;
    };

    // Dibujar encabezado
    drawRow(headers, true);

    // Dibujar productos
    productos.forEach((p) => {
      drawRow([
        p.id,
        p.nombre,
        p.codigoBarras,
        p.descripcion,
        p.cantidad
      ]);
    });


    // Pie de página
    doc.moveTo(40, doc.page.height - 40)
      .lineTo(doc.page.width - 40, doc.page.height - 40)
      .stroke();

      doc.font('Helvetica-Oblique').fontSize(9).fillColor('#444')
      .text(`“El presente documento ha sido generado electrónicamente a través del sistema LogistIQ con fecha y hora ${new Date().toLocaleString()}, 
por el usuario identificado como ${req.user.username}, quien posee credenciales de acceso válidas y autorizadas conforme a los protocolos internos de seguridad y privacidad de la entidad. La información contenida en este reporte corresponde a los datos registrados en la base de datos institucional al momento de su emisión, y se presenta exclusivamente con fines de control operativo, auditoría interna y trazabilidad documental. 

Cualquier modificación, alteración o intervención posterior a la generación de este documento no se verá reflejada en el contenido aquí consignado. Este reporte forma parte integral del historial técnico-administrativo de la empresa y puede ser utilizado como soporte en procesos legales, contables o de verificación normativa. 

Se prohíbe expresamente la reproducción, distribución o divulgación total o parcial de este documento sin la autorización previa, expresa y por escrito de la entidad emisora. El uso indebido de este contenido podrá ser objeto de sanciones conforme a las disposiciones legales vigentes. ”\n\n© 2025 LogistIQ. Todos los derechos reservados.`, 40, doc.page.height - 30, {
        align: 'justify'
      });
    doc.moveDown(2);
  

    doc.end();

  } catch (err) {
    console.error('Error al generar el PDF:', err);
    res.status(500).json({
      error: 'Error al generar el PDF',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
});



    const options = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }


    const server = https.createServer(options, app).listen(443, '0.0.0.0', () => {


      console.log('Servidor HTTPS corriendo en el puerto 443');




    })





    const io = socketIo(server, {
      cors: {
        origin: "*", // Permite conexiones desde cualquier origen
        methods: ["GET", "POST"]
      }
    });
    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);
    
      // Manejar autenticación
      socket.on('authenticate', async ({ userId, empresa_id }) => {
        try {
          const dbEmpresa = await getEmpresaDb(empresa_id);
      
          socket.dbEmpresa = dbEmpresa;
          socket.empresa_id = empresa_id;
          socket.userId = userId;
      
          socket.join(`empresa_${empresa_id}_user_${userId}`);
          console.log(`Usuario ${userId} autenticado en empresa ${empresa_id}`);
        } catch (err) {
          console.error('Error al autenticar en sockets:', err);
          socket.disconnect();
        }
      });
    
      // Manejar token de autenticación al conectar
      (async () => {
        try {
          const token = socket.handshake.auth.token;
          if (!token) {
            console.error('Token no enviado en la conexión Socket.IO');
            return;
          }
      
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const empresa_id = decoded.empresa_id;
          console.log('Empresa del socket:', empresa_id);
      
          const dbEmpresa = await getEmpresaDb(empresa_id);
          socket.dbEmpresa = dbEmpresa;
      
          // Configurar listener para mensajes
          socket.removeAllListeners('sendMessage');
          socket.on('sendMessage', async (msgData) => {
            try {
              const { sender_id, receiver_id, message } = msgData;
      
              if (!receiver_id) {
                console.error('receiver_id es obligatorio para guardar un mensaje.');
                return;
              }
      
              await socket.dbEmpresa.query(
                'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
                [sender_id, receiver_id, message]
              );
      
              io.emit('receiveMessage', msgData);
            } catch (error) {
              console.error('Error al guardar el mensaje:', error);
            }
          });
      
        } catch (err) {
          console.error('Error en la conexión del socket:', err);
        }
      })();
    
      // Manejar desconexión
      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        socket.removeAllListeners();
      });
    });
    app.get('/test-xss', (req, res) => {
      res.send(`
        <html>
          <head><title>Test XSS</title></head>
          <body>
            <h1>Probando XSS</h1>
            <script>alert('💀 XSS funcionando');</script>
          </body>
        </html>
      `);
    });
    




    app.use(limiter);

// server.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
// app.listen(PORT, () => {
//   console.log(`Servidor HTTP escuchando en http://localhost:${PORT}`);
// });
