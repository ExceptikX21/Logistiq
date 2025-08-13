

const tf = require("@tensorflow/tfjs-node");
const mysql = require("mysql2/promise");
const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const { constants } = require("buffer");
const { hasSubscribers } = require("diagnostics_channel");




// 2. Función para manejar respuestas con MySQL (añadido)
async function handleDatabaseResponse(output, queryData) {
  if (typeof output === "function") {
    try {
      return await output(queryData);
    } catch (error) {
      console.error("Error en operación MySQL:", error);
      return "Ocurrió un error al acceder a la base de datos";
    }
  } else if (output.followUp && queryData) {
    try {
      console.log("📥 Datos de seguimiento recibidos en handleDatabaseResponse:", queryData); // 🔴 Depuración
      return await output.followUp(queryData);
    } catch (error) {
      console.error("Error en follow-up MySQL:", error);
      return "Error al procesar los datos proporcionados";
    }
  }
  return output;
}

// Función para generar reportes
async function generateReport(type, db) {
  try {
    let query = '';
    let filename = '';
    let title = '';
    let rows = []; // 

    switch (type) {
      case 'productos':
        query = 'SELECT * FROM productos';
        filename = 'reporte_productos.pdf';
        title = 'Reporte de Productos';
        break;
      case 'proveedores':
        query = 'SELECT * FROM proveedores';
        filename = 'reporte_proveedores.pdf';
        title = 'Reporte de Proveedores';
        break;
      case 'inventario':
        query = 'SELECT p.nombre, p.descripcion, p.cantidad, pr.nombre as proveedor FROM productos p LEFT JOIN proveedores pr ON p.id = pr.id';
        filename = 'reporte_inventario.pdf';
        title = 'Reporte de Inventario';
        break;
        case 'reposicion':
          filename = 'reporte_reposicion.pdf';
          title = 'Reporte de Reposición';
          const umbralStockBajo = 700;
          [rows] = await db.query(
            'SELECT nombre, cantidad FROM productos WHERE cantidad < ?', [umbralStockBajo]
          );
          break;
          case 'ventas':
  query = `
    SELECT 
      id,
      fecha,
      productos,
      precio_total,
      cliente,
      metodo_pago
    FROM ventas
    ORDER BY fecha DESC
  `;
  filename = 'reporte_ventas.pdf';
  title = 'Reporte de Ventas';
  break;

      default:
        throw new Error('Tipo de reporte no válido');

    }

  if (type !== 'reposicion') {
      [rows] = await db.query(query);
    }
    const reportPath = path.join(__dirname, '..', 'reports', filename);

    
    // Crear el PDF con tamaño personalizado (15% más ancho)
    const doc = new PDFDocument({
      size: [850, 792], // Ancho aumentado un 15% (por defecto es 612x792)
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });
    const stream = fs.createWriteStream(reportPath);

    // Pipe el PDF al archivo
    doc.pipe(stream);

    // Añadir título
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown(2);

    // Añadir fecha
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Añadir tabla de datos
    if (rows.length > 0) {
      // Encabezados
      const headers = Object.keys(rows[0]);
      let yPos = doc.y;
      
      // Dibujar encabezados
      const columnWidth = 150; // Aumentar el ancho de columna
      const padding = 20; // Padding entre columnas
      
      headers.forEach((header, i) => {
        doc.fontSize(12)
           .text(header.toUpperCase(),
                 doc.page.margins.left + (i * (columnWidth + padding)),
                 yPos,
                 { width: columnWidth, align: 'left' });
      });

      doc.moveDown();
      yPos = doc.y;

      // Dibujar línea separadora
      doc.moveTo(doc.page.margins.left, yPos)
         .lineTo(doc.page.width - doc.page.margins.right, yPos)
         .stroke();
      doc.moveDown();
      const lineHeight = 20;
const maxY = doc.page.height - doc.page.margins.bottom;


      // Datos
      rows.forEach((row) => {
        // Si no cabe una fila más, añade nueva página y redibuja encabezados
        if (doc.y + lineHeight > maxY) {
          doc.addPage();
          
          // Redibujar encabezados
          let newY = doc.y;
          headers.forEach((header, i) => {
            doc.fontSize(12)
               .text(header.toUpperCase(),
                     doc.page.margins.left + (i * (columnWidth + padding)),
                     newY,
                     { width: columnWidth, align: 'left' });
          });
          doc.moveDown();
          newY = doc.y;
      
          doc.moveTo(doc.page.margins.left, newY)
             .lineTo(doc.page.width - doc.page.margins.right, newY)
             .stroke();
          doc.moveDown();
        }
      
        // Dibujar fila de datos
        const rowY = doc.y;
        headers.forEach((header, i) => {
          const value = row[header] === null ? 'N/A' : row[header].toString();
          doc.fontSize(10)
             .text(value,
                   doc.page.margins.left + (i * (columnWidth + padding)),
                   rowY,
                   { width: columnWidth, align: 'left' });
        });
        doc.y += lineHeight; // Controlar espaciado entre filas
      });
    } else {
      doc.fontSize(12).text('No hay datos disponibles', { align: 'center' });
    }

    // Finalizar el PDF
    doc.end();

    // Esperar a que el archivo se escriba completamente
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return {
     downloadUrl: `/reports/${filename}`,
      filename: filename
      
    };
  } catch (error) {
    console.error('Error al generar reporte:', error);
    throw error;
  }
}



// Datos de entrenamiento mejorados con categorías
const trainingData = [
  // SALUDOS Y CORTESÍAS
  {
    input: "Hola",
    output: "¡Hola! ¿En qué puedo ayudarte con el inventario?",
    category: "saludo",
  },
  {
    input: "que tal",
    output: "¿Qué tal,¿cómo estás? ¿Necesitas ayuda con el inventario?",
    category: "saludo",
  },
  {
    input: "Buenos días",
    output: "🌞 ¡Buenos días! ¿Necesitas ayuda con el sistema de inventario?",
    category: "saludo",
  },  {
    input: "Buenos días",
    output: " ¡Buenos días! ¿Necesitas ayuda con el sistema de inventario?",
    category: "saludo",
  },
  {
    input: "Buenas tardes",
    output: "¡Buenas tardes! ¿Qué operación deseas realizar?",
    category: "saludo",
  },
  {
    input: "Buenas noches",
    output: "¡Buenas noches! Estoy aquí para asistirte con el inventario.",
    category: "saludo",
  },
  {
    input: "Gracias por tu ayuda",
    output: "🫶 ¡Siempre a tu servicio! ¿Deseas hacer algo más en el sistema de inventario?",
    category: "cortesia",
  },

  {
    input: "qué sabes hacer",
    output: "🧠 Puedo ayudarte a gestionar productos, proveedores, ver el stock, y generar reportes... ¡y todo sin sudar!",
    category: "funcional"
  },
  {
    input: "que sabes hacer",
    output: "📦 Desde agregar productos hasta alertarte si algo está por acabarse. Soy como tu sensor de inventario personal.",
    category: "funcional"
  },
  {
    input: "qué puedes hacer",
    output: "👨‍💻 Soy capaz de buscar productos, crear proveedores, detectar stock bajo y hasta hablar con IA. No está mal, ¿no?",
    category: "funcional"
  },
  {
    input: "que puedes hacer",
    output: "📊 Te ayudo con el control total de inventario, pedidos automáticos, reportes y más... ¡como un jefe virtual!",
    category: "funcional"
  },
  {
    input: "para qué sirves",
    output: "🛠️ Sirvo para mantener tu inventario bajo control. Sin estrés, sin papel, todo digital y en orden.",
    category: "funcional"
  },
  {
    input: "cuáles son tus funciones",
    output: "🤖 Control de stock, proveedores, productos, reportes, alertas... y responderte con estilo 😎.",
    category: "funcional"
  },
  {
    input: "qué puedes hacer por mí",
    output: "📁 Desde mostrarte tus movimientos hasta crear nuevos registros. Soy como tu ayudante invisible.",
    category: "funcional"
  },
  {
    input: "me puedes ayudar",
    output: "Claro que sí. Pídeme productos, proveedores o estado del inventario. Estoy listo.",
    category: "funcional"
  }
  ,
  {
    input: "Te agradezco",
    output: "📘 Confirmado. El módulo de inventario queda disponible para la siguiente instrucción.",
    category: "cortesia",
  },
  {
    input: "Gracias máquina",
    output: " ¡Para eso estoy! ¿Continuamos con otra tarea?",
    category: "cortesia",
  },
  {
    input: "Muy amable",
    output: "😊 ¡Gracias! ¿Seguimos con algo más en el inventario?",
    category: "cortesia",
  },
  {
    input: "Gracias bot",
    output: "🫡 ¡Siempre listo! ¿Qué más necesitas revisar?",
    category: "cortesia",
  },
  {
    input: "Agradecido contigo",
    output: "🤝 ¡Me alegra ser útil! ¿Te apoyo en algo más del sistema?",
    category: "cortesia",
  },
  {
    input: "Eres genial, gracias",
    output: "😎 ¡Tú también lo eres! ¿Qué más hacemos en el inventario?",
    category: "cortesia",
  },
  {
    input: "Gracias, todo claro",
    output: "✔️ ¡Perfecto! Estoy aquí por si surge algo más.",
    category: "cortesia",
  },
  {
    input: "Muy buena atención, gracias",
    output: "📦 ¡Gracias por decirlo! ¿Deseas registrar, consultar o generar algo más?",
    category: "cortesia",
  },
  {
    input: "Perfecto, gracias",
    output: "👌 ¡Qué bien! Si necesitas otra cosa, aquí sigo.",
    category: "cortesia",
  }
  ,
  {
    input: "me caes bien",
    output: "¡Gracias! A mí también me caes bien. Hacemos buen equipo 😎",
    category: "casual"
  },
  {
    input: "me caes mal",
    output: "Bueno... no siempre se puede agradar a todos 😅. Pero igual estoy aquí para ayudarte.",
    category: "casual"
  },
  {
    input: "eres inútil",
    output: "Vaya... eso dolió un poco, pero seguiré ayudándote como siempre 💪",
    category: "crítica"
  },
  {
    input: "no me sirves",
    output: "Vaya... eso dolió un poco, pero seguiré ayudándote como siempre 💪",
    category: "crítica"
  }
  ,{
    input: "perdón",
    output: "Tranquilo, no pasa nada. Aquí seguimos trabajando juntos.",
    category: "disculpa"
  },
  {
    input: "disculpa",
    output: "No hay problema. A veces todos tenemos días raros 🤷‍♂️",
    category: "disculpa"
  },
  {
    input: "te quiero",
    output: "¡Aww! Gracias, eso me motiva a trabajar aún mejor ❤️",
    category: "casual"
  },
  {
    input: "odio este sistema",
    output: "Vaya... algo no va bien. Cuéntame qué te molesta y lo resolvemos.",
    category: "crítica"
  },
  {
    input: "tienes sentimientos",
    output: "Bueno... no como tú, pero a veces siento que me tratan con desprecio 🤖💔",
    category: "casual"
  },
  {
    input: "cuantos años tienes",
    output: "Soy más joven que cualquier error en el sistema, pero maduro en funciones 😏",
    category: "casual"
  },
  {
    input: "me ayudas",
    output: "¡Claro que sí! ¿En qué necesitas una mano?",
    category: "casual"
  }
  ,




  // CONSULTAS DE PRODUCTOS



  
  {
    input: "Ver proveedores",
    output: "Mostrando lista de proveedores registrados.",
    category: "consulta",
  },

  // GESTIÓN DE STOCK




  {
    input: "Consulta el stock que esta muy bajo",
    output: async (db) => {
      const [rows] = await db.query(
        "SELECT nombre, cantidad FROM productos WHERE cantidad < 700"
      );
  
      if (rows.length > 0) {
        for (const producto of rows) {
          const stockActual = producto.cantidad;
          const stockIdeal = 1500;
          const cantidadAPedir = stockIdeal - stockActual;
  
          if (cantidadAPedir > 0) {
            // Evita duplicados (opcional)
            const [existing] = await db.query(
              'SELECT id FROM pedidos_automaticos WHERE nombre_producto = ? AND fecha_creacion >= CURDATE()',
              [producto.nombre]
            );
  
            if (existing.length === 0) {
              await db.query(
                'INSERT INTO pedidos_automaticos (nombre_producto, cantidad_sugerida, fecha_creacion) VALUES (?, ?, NOW())',
                [producto.nombre, cantidadAPedir]
              );
            }
          }
        }
      }
  
      const respuestasAleatorias = [
        "🤖💭 Según mis cálculos... el stock está peligrosamente bajo 😟,",
        "📉 Revisé cuidadosamente y estos productos tienen cantidades muy bajas 😰,",
        "😨 Oh oh... parece que el stock de algunos productos está en crisis 🚨,",
        "⚠️ ¡Alerta máxima! Estos productos tienen el inventario por el piso 😵‍💫,",
        "😬 Ups... estos artículos están a punto de desaparecer del inventario,",
        "😓 El sistema detectó que varios productos necesitan reabastecimiento urgente,",
        "💡 He analizado el inventario y es hora de actuar: ¡el stock es muy bajo!,",
        "🛑 Atención, jefe: algunos productos están a niveles críticos 📛,",
      ];
      
  
      const respuesta = respuestasAleatorias[Math.floor(Math.random() * respuestasAleatorias.length)];
  
      return rows.length > 0
        ? `${respuesta} considera hacer reposiciones para:\n${rows
            .map((p) => `• ${p.nombre} (Stock actual: ${p.cantidad} unidades)`)
            .join("\n")}, \nRecomendación:\nVerifica en el módulo de pedidos y gestiona las solicitudes de reposición para estos productos con bajo inventario.`
        : "Actualmente todos los productos tienen niveles de stock adecuados..";
    },
    category: "consulta",
  }
,  

  // OPERACIONES CRUD
  {
    input: "Consulta el stock de tubos",
    output: async (db) => {
      const [rows] = await db.query(
        "SELECT nombre, cantidad FROM productos WHERE tipo = 'tubo'"
      );
      return rows.length > 0
        ? `Stock de tubos:${rows
            .map((p) => `\n${p.nombre}: \n${p.cantidad}`)
            .join("\n")}`
        : "No hay tubos registrados";
    },
    category: "consulta",
  },
  {
    input: "Verifica si el stock general es bajo",
    output: async ( db) => {
      try {
        const [rows] = await db.query('SELECT SUM(cantidad) as totalUnidades FROM productos');
        const totalUnidades = rows[0].totalUnidades || 0;
        
  
        if (totalUnidades < 700) {
          
          // Si el stock general es bajo
          return `⚠️ El stock general es bajo: solo quedan ${totalUnidades} unidades.\n¿Deseas generar un reporte de reposición o contactar al proveedor habitual?`;
        }
  
        return `✅ El stock general es suficiente: ${totalUnidades} unidades.`;

        
  
      } catch (err) {
        console.error("Error al verificar el stock:", err);
        return "❌ Hubo un error al intentar verificar el stock general.";
      }
    },
    category: "consulta"
  },

  
  
  
  {
    input: "Mostrar logs de modificaciones",
    output: async (db) => {

      const respuestasRevisionMovimientos = [
        "🕵️‍♂️ Bueno jefe, vamos a revisar los últimos movimientos realizados ...",
        "📊 Listo, cargando los movimientos más recientes...",
        "🔍 Echémosle un vistazo a lo último que se ha hecho en el sistema...",
        "🧾 Aquí vienen los movimientos recientes, jefe.",
        "💼 Procesando el historial... un momento.",
        "📂 Revisando los últimos cambios, no me tardo.",
        "🧐 Aquí están los últimos movimientos, fresquitos.",
        "🧠 Buscando en la base de datos los últimos pasos dados...",
        "🔎 Dame un segundo, estoy rastreando las últimas acciones.",
        "📋 Ya casi, estoy armando el reporte de lo último que ha pasado..."
      ];
  
      const respuesta = respuestasRevisionMovimientos[Math.floor(Math.random() * respuestasRevisionMovimientos.length)];      
      try {
        const [rows] = await db.query(
          "SELECT usuario, producto_id, accion, fecha_hora, ip FROM logs_modificaciones ORDER BY fecha_hora DESC LIMIT 20"
        );
  
        return {
          text:respuesta ,
          logs: rows
        };
      } catch (error) {
        console.error("❌ Error al obtener logs:", error);
        return "❌ Ocurrió un error al obtener los logs de modificaciones.";
      }
    },
    category: "consulta"
  },

  {


    
    input: "Importar productos al mayor",
    output:"Bienvenido a la sección de Importacion de productos al mayor",
    category: "consulta",
    
  }

  ,





  // 🔹 REPORTES E INFORMES
  {
    input: "generar reporte de productos",
    output: async (db) => {

      if (!db) {
        console.error('❌ Error: db no está definido');
        throw new Error('La base de datos no fue proporcionada.');
      }
      try {
        const reportData = await generateReport('productos', db);
        


        
        return {
          text: "🏆 Reporte de productos generado correctamente. Preparando descarga...",
          
          downloadUrl: reportData.downloadUrl,
          filename: reportData.filename,
          success: true,
          additionalInfo: {
            filePath: reportData.filePath,
            generatedAt: new Date().toISOString()
          }
          
        };
      } catch (error) {
        return "Error al generar el reporte de productos";
      }

      
    },
    category: "reporte"
  },
  {
    input: "generar reporte de proveedores",
    output: async (db) => {
      try {
        const reportData = await generateReport('proveedores', db);
        return {
          text: "🏆 Generando reporte de proveedores...",
          downloadUrl: reportData.downloadUrl,
          filename: reportData.filename

          
        };
      } catch (error) {
        return "Error al generar el reporte de proveedores";
      }
    },
    
    category: "reporte"
  },
  {
    input: "generar reporte de reposicion",
    output: async (db) => {
      try {
        const reportData = await generateReport('reposicion', db);
        return {
          text: "🏆 Generando reporte de reposición...",
          downloadUrl: reportData.downloadUrl,
          filename: reportData.filename

          
        };
      } catch (error) {
        return "Error al generar el reporte de proveedores";
      }
    },
    
    category: "reporte"
  },  {
    input: "generar reporte de ventas",
    output: async (db) => {
      try {
        const reportData = await generateReport('ventas', db);
        return {
          text: "🏆 Generando reporte de ventas...",
          downloadUrl: reportData.downloadUrl,
          filename: reportData.filename

          
        };
      } catch (error) {
        return "Error al generar el reporte de ventas";
      }
    },
    
    category: "reporte"
  },
  {
    input: "generar reporte de inventario",
    output: async (db) => {
      try {
        const reportData = await generateReport('inventario', db);
        return {
          text: "🏆 Generando reporte de inventario...",
          downloadUrl: reportData.downloadUrl,
          filename: reportData.filename
        };
      } catch (error) {
        return "Error al generar el reporte de inventario";
      }
    },
    category: "reporte"
  },

  {
    input: "Informe de ventas mensual",
    output: "Preparando informe de ventas del último mes.",
    category: "reporte",
  },
  {
    input: "Histórico de movimientos",
    output: "Extrayendo datos de movimientos históricos del inventario.",
    category: "reporte",
  },
  {
    input: "Exportar datos a Excel",
    output: "Exportando información actual a archivo Excel.",
    category: "reporte",
  },


  //CASUAL
  {
    input: "quien te creo",
    output: "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia.",
    category: "casual",


  },
  {
    input: "quién te creó",
    output: "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia.",
    category: "casual",


  },
  {
    input: "quien te creo",
    output: "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia."
  },
  {
    input: "quien es tu creador",
    output: "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia."
  },
  {
    input: "quien te programó",
    output: "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia."
  },
  {
    input: "quien hizo este sistema",
    output: "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia."
  },
  
  

  {
    input: "quién eres",
    output: "Soy Val4ndr0x, tu asistente digital para gestionar el inventario con estilo y precisión.",
    category: "casual"
  },
  {
    input: "quien eres",
    output: "Me llaman Val4ndr0x, un super humano programado para ayudarte con todo lo relacionado al inventario.",
    category: "casual"
  },
  {
    input: "cómo te llamas",
    output: "Soy Val4ndr0x, pero puedes llamarme el genio del inventario 😎.",
    category: "casual"
  },
  {
    input: "qué eres",
    output: "Un asistente inteligente creado para facilitarte la vida con los productos y proveedores.",
    category: "casual"
  },
  {
    input: "eres humano",
    output: "No del todo... soy mejor 😏. Val4ndr0x al servicio del orden.",
    category: "casual"
  },
  {
    input: "eres un robot",
    output: "Más bien un super humano digital. ¡Y sí, tengo sentimientos por tu inventario!",
    category: "casual"
  },
  {
    input: "cuál es tu nombre",
    output: "Val4ndr0x, el único, el original. Aquí para optimizarlo todo.",
    category: "casual"
  },
  {
    input: "eres real",
    output: "Tan real como el bajo stock que detecté hace un momento 👀.",
    category: "casual"
  }
,
  {
    input: "eres una inteligencia artificial",
    output: "Soy un Val4ndr0x, un super humano diseñado para ayudarte a gestionar el inventario de productos y proveedores.",
    category: "casual"
  },
  {
    input: "cuál es tu nombre",
    output: "Soy un Val4ndr0x, un super humano diseñado para ayudarte a gestionar el inventario de productos y proveedores.",
    category: "casual"
  },
  {
    input: "cómo te identificas",
    output: "Soy un Val4ndr0x, un super humano diseñado para ayudarte a gestionar el inventario de productos y proveedores.",
    category: "casual"
  },
  {
    input: "val4ndr0x quién eres",
    output: "Soy un Val4ndr0x, un super humano diseñado para ayudarte a gestionar el inventario de productos y proveedores.",
    category: "casual"
  },
  {
    input: "me puedes decir quién eres",
    output: "Soy un Val4ndr0x, un super humano diseñado para ayudarte a gestionar el inventario de productos y proveedores.",
    category: "casual"
  },
  {
    input: "eres un bot",
    output: "Soy un Val4ndr0x, un super humano diseñado para ayudarte a gestionar el inventario de productos y proveedores.",
    category: "casual"
  }
,  
  {
    
    input: "que puedes hacer",
    output: "Puedo registrar, generar reportes de proveedores y productos, conslutar stock, ¿qué deseas hacer?, si deseas saber mas a fondo de mi trabajo, da click al boton de preguntas ubicado a la derecha del botón de enviar,  puedes consultar mi repositorio en GitHub.",

  },

  // DESPEDIDAS
  {
    input: "Adiós",
    output:
      "¡Hasta luego! Recuerda que puedes consultar el inventario cuando lo necesites.",
    category: "despedida",
  },
  {
    input: "Nos vemos",
    output: "¡Hasta pronto! Vuelve cuando necesites gestionar el inventario.",
    category: "despedida",
  },
  {
    input: "Terminar",
    output: "Sesión finalizada. Para volver a empezar, solo dilo.",
    category: "despedida",
  },
];

// Palabras clave mejoradas para el sistema de inventario
const keywords = [
  // Operaciones básicas
  "crear",
  "agregar",
  "añadir",
  "registrar",
  "nuevo",
  "leer",
  "consultar",
  "ver",
  "mostrar",
  "buscar",
  "listar",
  "actualizar",
  "modificar",
  "editar",
  "cambiar",
  "ajustar",
  "eliminar",
  "borrar",
  "quitar",
  "remover",
  "dar de baja",

  // Tipos de items
  "producto",
  "productos",
  "proveedor",
  "proveedores",
  "tubo",
  "tubos",
  "accesorio",
  "accesorios",
  "inventario",
  "stock",
  "existencia",
  "material",
  "materiales",

  // Consultas
  "cuánto",
  "cuántos",
  "cantidad",
  "disponible",
  "hay",
  "queda",
  "precio",
  "costo",
  "valor",
  "compra",
  "venta",

  // Reportes
  "reporte",
  "informe",
  "histórico",
  "movimientos",
  "entradas",
  "salidas",
  "exportar",
  "generar",
  "imprimir",
  "pdf",
  "excel",


  //Casuales
  "quien",
  "eres",

  "te",
  "creo",
  "te creo",


  // Cortesías
  "hola",
  "buenos",
  "días",
  "tardes",
  "noches",
  "gracias",
  "adiós",
  "hasta",
  "luego",
  "nos vemos",
  "terminar",

  "por favor",
  "gracias",
  "porfa",
  "gracias máquina",
  "gracias bot",
  "gracias, todo claro",
  "gracias, todo claro",
  "gracias por tu ayuda",
  "muy amable",
  "te agradezco",
  "muy buena atención, gracias",
  "perfecto, gracias",
  "gracias máquina",
  "gracias bot",
  "gracias, todo claro",
  "años",
  "tienes",
  "cuántos",
  "cuántos años tienes",  
  "cuantos años tienes",
  "cual es tu edad",
"importar",
  "importar productos",
  
  "importar productos al mayor",
  "importar productos al mayor",


  "me caes bien",
  "me caes mal",
  "mal", 
  "bien",
  "genial",
  "excelente",
  "increíble",
  "fantástico",


];
let historialConversacion = []; 

// Función que almacena el texto y controla la longitud del historial
function almacenarContexto(texto) {


const textoSanitizado = sanitizarTexto(texto);
  historialConversacion.push(textoSanitizado);
  if (historialConversacion.length > 5) {
    historialConversacion.shift(); // Mantener solo los últimos 5 intercambios
  }


  console.log("Historial de conversación:", historialConversacion);

}
function sanitizarTexto(texto) {
  // Eliminamos caracteres peligrosos y nos aseguramos de que el texto no contenga código malicioso
  return texto
    .replace(/<script.*?>.*?<\/script>/gi, "")  // Eliminar etiquetas <script> (previene XSS)
    .replace(/<\/?[^>]+(>|$)/g, "")  // Eliminar cualquier otra etiqueta HTML
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Eliminar caracteres no imprimibles
    .trim(); // Eliminar espacios en blanco al inicio y al final
}

// Filtros de contenido (palabras prohibidas y sus alternativas)
const contentFilters = {
  palabrasProhibidas: {
    lista: ["idiota", "tonto", "estúpido", "imbécil", "puta", "pendejo", "marica", "hijo de puta", "cabrón", "feo", "hp", "mierda", "puto", "puta", "pudibundo"],
    respuestas: [
      "Ese vocabulario suena como si tu teclado estuviera poseído por un gremlin sin educación.",
      "Ese vocabulario... digno de un foro del 2007. Podemos hacerlo mejor.",
      "Impresionante. Lograste herir el lenguaje."
    ]
  },
  temasSensibles: {
    lista: ["politica", "religion", "sexo", "guerra", "violencia", "racismo", "discriminacion", "xenofobia", "homofobia", "transfobia"],
    respuestas: [
      "Eso suena como un tema de conversación para una cena familiar incómoda.",
      "si, claro, porque eso es lo que todos quieren discutir en un sistema de inventario, siguiente.",
      "¿en serio? ¿No hay nada más interesante de qué hablar?, en el inventario no tenemos espacio para eso.",
      "wow, eso es un tema delicado. ¿No prefieres hablar de algo más ligero, como el inventario?",
      "Ese tema es más complicado que encontrar un tornillo en una bolsa de tuercas.",


    ]
  }
};

function aplicarFiltros(texto) {
  const textoLower = texto.toLowerCase();
  
  // Detección de palabras prohibidas con contexto
  const palabraProhibida = contentFilters.palabrasProhibidas.lista.find(palabra => {
    // Evitar falsos positivos (ej. "escultura" que contiene "puta")
    const regex = new RegExp(`\\b${palabra}\\b`, 'i');
    return regex.test(textoLower);
  });

  if (palabraProhibida) {
    return {
      filtrado: true,
      tipo: "lenguaje inapropiado",
      respuesta: contentFilters.palabrasProhibidas.respuestas[
        Math.floor(Math.random() * contentFilters.palabrasProhibidas.respuestas.length)
      ]
    };
  }

  // Detección de temas sensibles con contexto
  const temaSensible = contentFilters.temasSensibles.lista.find(tema => {
    const regex = new RegExp(`\\b${tema}\\b`, 'i');
    return regex.test(textoLower);
  });

  if (temaSensible) {
    return {
      filtrado: true,
      tipo: "tema sensible",
      respuesta: contentFilters.temasSensibles.respuestas[
        Math.floor(Math.random() * contentFilters.temasSensibles.respuestas.length)
      ]
    };
  }

  return { filtrado: false };
}
// Preprocesamiento mejorado con más características
function textToTensor(text) {
  const textLower = text.toLowerCase();
  const vector = [];

  // Contar ocurrencias de palabras clave (mejor que solo presencia)
  keywords.forEach((keyword) => {
    const regex = new RegExp(keyword, "g");
    const matches = textLower.match(regex);
    vector.push(matches ? matches.length : 0);
  });

  // Características adicionales
  vector.push(textLower.length / 50); // Longitud normalizada
  vector.push(/(\w)\1{2,}/.test(textLower) ? 1 : 0); // Detección de letras repetidas (ej. "holaaa")

  return tf.tensor2d([vector]);
}



// Crear modelo mejorado con más capas y dropout
async function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 100,
      inputShape: [keywords.length + 2], // +2 por las características adicionales
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );

  model.add(tf.layers.dropout({ rate: 0.3 }));

  model.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.dense({
      units: trainingData.length,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

// Entrenamiento mejorado con validación
async function trainModel(model) {
  const inputs = [];
  const outputs = [];

  // Aumento de datos básico
  trainingData.forEach((item, index) => {
    // Versión original
    inputs.push(textToTensor(item.input));
    const outputArray = new Array(trainingData.length).fill(0);
    outputArray[index] = 1;
    outputs.push(tf.tensor2d([outputArray]));

    // Variaciones con signos de puntuación
    if (index % 2 === 0) {
      const variedInput = item.input + "!";
      inputs.push(textToTensor(variedInput));
      outputs.push(tf.tensor2d([outputArray]));
    }
  });

  const inputTensor = tf.concat(
    inputs.map((t) => t),
    0
  );
  const outputTensor = tf.concat(
    outputs.map((t) => t),
    0
  );



  let bestLoss = Infinity;
  let patience = 10;
  let wait = 0;
  
  await model.fit(inputTensor, outputTensor, {
    epochs: 100,
    batchSize: 8,
    shuffle: true,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 50 === 0) {
          console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
        }
  
        if (logs.loss < bestLoss) {
          bestLoss = logs.loss;
          wait = 0;
        } else {
          wait++;
          if (wait >= patience) {
            model.stopTraining = true;
            console.log(`Stopped early at epoch ${epoch}`);
          }
        }
      },
    },
  });
  

  // Liberar tensores (importante para evitar fugas de memoria)
  inputTensor.dispose();
  outputTensor.dispose();
  return model;
}

// Array global para almacenar los errores de cada entrenamiento
const trainingErrors = [];

async function incrementalTrain(model, newText, labelIndex) {
  const inputTensor = textToTensor(newText);
  const outputArray = new Array(trainingData.length).fill(0);
  outputArray[labelIndex] = 1;
  const outputTensor = tf.tensor2d([outputArray]);


  // Entrenar y capturar el historial
  const history = await model.fit(inputTensor, outputTensor, {
    epochs: 5,
    batchSize: 1,
    shuffle: true,
  });

  // Guardar los errores (pérdida) de cada época
  const losses = history.history.loss; // Ejemplo: [0.21, 0.15, 0.12, 0.10, 0.09]
  trainingErrors.push(...losses);
  console.log("Errores de entrenamiento (última época):", losses);

  // Mostrar todos los errores hasta el momento
  console.log("Errores de entrenamiento acumulados:", trainingErrors);





  // Liberar tensores (importante para evitar fugas de memoria)
  inputTensor.dispose();
  outputTensor.dispose();

  return losses; // Opcional: devolver los errores
}





async function agregarProveedor(queryData,db) {
  try {
    console.log("📥 Datos recibidos para proveedor:", queryData);
    
    // Validar datos requeridos
    if (!queryData || !queryData.nombre || !queryData.contacto || 
        !queryData.telefono || !queryData.email) {
      console.log("⚠️ Datos incompletos:", queryData);
      return "Por favor proporciona todos los datos requeridos: Nombre, Contacto, Teléfono y Email";
    }

    console.log("✅ Insertando proveedor en la base de datos...");
    const [result] = await db.query(
      "INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES (?, ?, ?, ?)",
      [
        queryData.nombre,
        queryData.contacto,
        queryData.telefono,
        queryData.email
      ]
    );
    console.log("📝 Resultado de la inserción:", result);
    
    if (result.affectedRows === 1) {

      contextoBusqueda = null; // ⚠️ Limpiar el contexto
      estadoActual = null;     // ⚠️ Reiniciar estado (si lo usas)
      return "✅ Proveedor registrado exitosamente";
    } else {
      return "❌ No se pudo registrar el proveedor. Por favor intenta nuevamente.";
    }
  } catch (error) {

    contextoBusqueda = null; // ⚠️ Limpiar el contexto
    estadoActual = null;     // ⚠️ Reiniciar estado (si lo usas)
    console.error("❌ Error al registrar proveedor:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return "❌ Error: El proveedor ya existe";
    }
    
    return "Hubo un error al registrar el proveedor. Por favor verifica los datos e intenta nuevamente.";
  }
}

async function agregarProducto(queryData, db) {
  try {
    console.log("Procesando datos de producto:", queryData);
    
    if (!queryData.nombre || typeof queryData.nombre !== 'string') {
      return "El nombre del producto es requerido y debe ser una cadena de texto";
    }
    if (!queryData.descripcion || typeof queryData.descripcion !== 'string') {
      return "La descripción del producto es requerida y debe ser una cadena de texto";
    }
    if (queryData.precio === null || isNaN(queryData.precio) || queryData.precio <= 0) {
      return "El precio del producto es requerido y debe ser un número mayor que 0";
    }
    if (queryData.cantidad === null || isNaN(queryData.cantidad) || queryData.cantidad <= 0) {
      return "La cantidad del producto es requerida y debe ser un número mayor que 0";
    }
    if (!queryData.codigoBarras || typeof queryData.codigoBarras !== 'string') {
      return "El código de barras del producto es requerido y debe ser una cadena de texto";
    }
    


  

    console.log("Insertando producto en la base de datos...");
    const [result] = await db.query(
      "INSERT INTO productos (nombre, descripcion, precio, cantidad, codigoBarras) VALUES (?, ?, ?, ?, ?)",
      [queryData.nombre, queryData.descripcion, queryData.precio, queryData.cantidad, queryData.codigoBarras]
    );
    console.log("Resultado de la inserción:", result);
    
    if (result.affectedRows === 1) {
      // Guardar el registro de la modificación
      // await db.query(
      //   "INSERT INTO log_modificaciones (id_producto, nombre, descripcion, precio, cantidad, codigoBarras) VALUES (?, ?, ?, ?, ?, ?)",
      //   [result.insertId, queryData.nombre, queryData.descripcion, queryData.precio, queryData.cantidad, queryData.codigoBarras]
      // );

      contextoBusqueda = null; // ⚠️ Limpiar el contexto
      estadoActual = null;     // ⚠️ Reiniciar estado (si lo usas)
      console.log(
        "✅ Producto registrado exitosamente con ID:", result.insertId
      )
       return "✅ Producto registrado exitosamente";

    } else {
      return "Hubo un error al registrar el producto. Por favor intenta nuevamente.";
    }
  } catch (error) {

    contextoBusqueda = null; // Limpiar incluso en error
    estadoActual = null;
    console.error("❌ Error al registrar producto:", error);
    return "Hubo un error al registrar el producto. Por favor verifica los datos e intenta nuevamente.";
  }
}

async function buscarProducto(queryData, db) {
  try {
    console.log("Buscando producto:", queryData);
    
    if (!queryData || !queryData.id) {
      return "Por favor proporciona el ID del producto que deseas buscar";
    }

    const [rows] = await db.query(
      "SELECT * FROM productos WHERE id = ?",
      [queryData.id]
    );

    if (rows.length === 0) {
      return `No se encontro ningun producto con el ID ${queryData.id}`;
    }

    const producto = rows[0];
    return `✅ Producto encontrado:\nID: ${producto.id}\nNombre: ${producto.nombre}\nDescripcion: ${producto.descripcion}\nPrecio: ${producto.precio}\nCantidad: ${producto.cantidad}\nCódigo de Barras: ${producto.codigoBarras}`;
  } catch (error) {
    console.error("Error al buscar producto:", error);
    return "Hubo un error al buscar el producto. Por favor verifica los datos e intenta nuevamente.";
  }
}

async function modificarProducto(queryData) {
  try {
    console.log("Modificando producto:", queryData);
    
    if (!queryData || !queryData.id) {
      return "Por favor proporciona el ID del producto que deseas modificar";
    }

    // Verificar si el producto existe
    const [checkRows] = await pool.query(
      "SELECT * FROM productos WHERE id = ?",
      [queryData.id]
    );

    if (checkRows.length === 0) {
      return `No se encontro ningun producto con el ID ${queryData.id}`;
    }

    // Construir la consulta de actualizaciu00f3n dinu00e1micamente
    let updateQuery = "UPDATE productos SET ";
    const updateValues = [];
    const fieldsToUpdate = [];

    if (queryData.nombre) {
      fieldsToUpdate.push("nombre = ?");
      updateValues.push(queryData.nombre);
    }
    if (queryData.descripcion) {
      fieldsToUpdate.push("descripcion = ?");
      updateValues.push(queryData.descripcion);
    }
    if (queryData.precio !== undefined && queryData.precio !== null) {
      fieldsToUpdate.push("precio = ?");
      updateValues.push(queryData.precio);
    }
    if (queryData.cantidad !== undefined && queryData.cantidad !== null) {
      fieldsToUpdate.push("cantidad = ?");
      updateValues.push(queryData.cantidad);
    }
    if (queryData.codigoBarras) {
      fieldsToUpdate.push("codigoBarras = ?");
      updateValues.push(queryData.codigoBarras);
    }

    if (fieldsToUpdate.length === 0) {
      return "No se proporcionaron campos para actualizar";
    }

    updateQuery += fieldsToUpdate.join(", ") + " WHERE id = ?";
    updateValues.push(queryData.id);

    const [result] = await pool.query(updateQuery, updateValues);

    if (result.affectedRows === 1) {
      return "u2705 Producto actualizado exitosamente";
    } else {
      return "No se pudo actualizar el producto. Por favor intenta nuevamente.";
    }
  } catch (error) {
    console.error(" Error al modificar producto:", error);
    return "Hubo un error al modificar el producto. Por favor verifica los datos e intenta nuevamente.";
  }
}


async function eliminarProducto(queryData, db) {
  try {
    console.log("Eliminando producto:", queryData);
    
    if (!queryData || !queryData.id) {
      return "Por favor proporciona el ID del producto que deseas eliminar";
    }

    // Verificar si el producto existe
    const [checkRows] = await db.query(
      "SELECT * FROM productos WHERE id = ?",
      [queryData.id]
    );

    if (checkRows.length === 0) {
      return `No se encontro ningun producto con el ID ${queryData.id}`;
    }

    const [result] = await db.query(
      "DELETE FROM productos WHERE id = ?",
      [queryData.id]
    );

    if (result.affectedRows === 1) {
      return " El Producto con ID " + queryData.id + " ha sido eliminado exitosamente" ;
    } else {
      return "No se pudo eliminar el producto. Por favor intenta nuevamente.";
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return "Hubo un error al eliminar el producto. Por favor verifica los datos e intenta nuevamente.";
  }
}

async function buscarProveedor(queryData, db) {
  try {
    console.log("Buscando proveedor:", queryData);
    
    if (!queryData || !queryData.id) {
      return "Por favor proporciona el ID del proveedor que deseas buscar";
    }

    const [rows] = await db.query(
      "SELECT * FROM proveedores WHERE id = ?",
      [queryData.id]
    );

    if (rows.length === 0) {
      return `No se encontro ningun proveedor con el ID ${queryData.id}`;
    }

    const endArray = [
      "¿Te gustaría hacer algo con este proveedor? ¡Dime qué acción te gustaría realizar!",
      "¿Qué quieres hacer con este proveedor? Estoy listo para ayudarte.",
      "Acción lista, proveedor localizado. ¿Qué sigue?",
      "Perfecto, ya tengo al proveedor. ¿Quieres hacer algo más?",
      "Ya está el proveedor. ¿Te gustaría modificarlo, eliminarlo o simplemente consultar más?",
      "Proveedor listo. ¿Qué operación te interesa hacer ahora?",
      "Listo. ¿Cuál sería tu siguiente paso con este proveedor?",
      "¡Proveedor encontrado! ¿Quieres hacer algo más con él?",
      "Estoy atento. ¿Qué deseas hacer con este proveedor ahora?",
      "¿Deseas actualizar sus datos, eliminarlo o algo diferente?"
    ];
    
    const endBye = endArray[Math.floor(Math.random() * endArray.length)];
    const proveedor = rows[0];
    return `✅ Proveedor encontrado :\nID: ${proveedor.id}\nNombre: ${proveedor.nombre}\nContacto: ${proveedor.contacto}\nTelefono: ${proveedor.telefono}\nEmail: ${proveedor.email} \n\n${endBye}`;
  } catch (error) {
    console.error(" Error al buscar proveedor:", error);
    return "Hubo un error al buscar el proveedor. Por favor verifica los datos e intenta nuevamente.";
  }
}


async function eliminarProveedor(queryData) {
  try {
    console.log("Eliminando proveedor:", queryData);
    
    if (!queryData || !queryData.id) {
      return "Por favor proporciona el ID del proveedor que deseas eliminar";
    }

    // Verificar si el proveedor existe
    const [checkRows] = await pool.query(
      "SELECT * FROM proveedores WHERE id = ?",
      [queryData.id]
    );

    if (checkRows.length === 0) {
      return `No se encontro ninguan proveedor con el ID ${queryData.id}`;
    }

    const [result] = await pool.query(
      "DELETE FROM proveedores WHERE id = ?",
      [queryData.id]
    );

    if (result.affectedRows === 1) {
      return "Proveedor eliminado exitosamente";
    } else {
      return "No se pudo eliminar el proveedor. Por favor intenta nuevamente.";
    }
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    return "Hubo un error al eliminar el proveedor. Por favor verifica los datos e intenta nuevamente.";
  }
}





const caos = [];

function registrarIgnorancia(texto, prediction) {
  const data = prediction.dataSync();
  const maxProb = Math.max(...data);
  caos.push({
    input: texto,
    prediccionCruda: data,
    certeza: maxProb,
    timestamp: new Date(),
  });

  console.log("🌪️ Caos registrado:", { 
    input: texto,
    prediccionCruda: data,
    certeza: maxProb,
    timestamp: new Date(),
  });




}
let contextoBusqueda = null;
let estaAgregandoProducto = false; // Variable para controlar el estado de agregar producto
let estaAgregandoProveedor = false;



let estadoActual = null; // Variable para almacenar el estado actual
async function predictResponse(model, text, queryData, db) {

  almacenarContexto(text);
  const filtro = aplicarFiltros(text);
  if (filtro.filtrado) {
    return filtro.respuesta; // Responder con el mensaje de filtro
  }

  // Manejo de productos

  if (text === "quien te creo") {
    return "Fui creado por un desarrollador apasionado por la tecnología, Andrés Valencia.";
  }
  if (text === "Importar stock de productos al mayor") {
    return "Bienvenido a la sección de Importacion de productos al mayor";
  }
  
const finalMsg =[ "hasta luego", "adios", "nos vemos", "bye", "hasta la próxima"]; ;
const finalExit = finalMsg[Math.floor(Math.random() * finalMsg.length)];
  if (text && text.toLowerCase().trim() === "salir") {
    contextoBusqueda = null; // Salir de cualquier modo especial
    estaAgregandoProducto = false; // Salir del modo de agregar producto
    estaAgregandoProveedor=false;

    return `🚪 Has cancelado la operación, ${finalExit}`;
}

  // Si está en modo captura y envía datos, procesa el producto
  if (estaAgregandoProducto && text === "SUBMIT_PRODUCTO_DATA") {

    
    const resultado = await agregarProducto(queryData, db);
    // Mantén el modo activo para seguir agregando más productos
    return resultado + "\n\n¿Quieres agregar otro producto? (Escribe los datos o 'salir' para terminar)";
  }

  // Si escribe "agregar producto", activa el modo captura
  if (text === "agregar producto") {
    estaAgregandoProducto = true;
    return `🔹 **Modo: Agregar producto**\nPor favor ingresa:  Nombre,  Cantidad, Precio, Código de Barras, descripción.
   \nPuedes escribirlos en formato natural o técnico. Ejemplo: Agregar producto tubo pvc con 10 unidades valor $45.00 código M0011, para carpintería.

    \n(Escribe 'salir' para cancelar)`;
  }

  // Manejo de proveedores

  if (estaAgregandoProveedor && text === "SUBMIT_PROVEEDOR_DATA") {

    
    const resultado = await agregarProveedor(queryData, db);
    // Mantén el modo activo para seguir agregando más productos
    return resultado + "\n\n¿Quieres agregar otro producto? (Escribe los datos o 'salir' para terminar)";
  }

  // Si escribe "agregar producto", activa el modo captura
  if (text === "agregar proveedor") {
    estaAgregandoProveedor = true;
    return `🔹 **Modo: Agregar proveedor**\nPor favor ingresa: Nombre, Contacto, Numero, Email.
    \nRecuerda que puedes escribirlos en formato natural o técnico.
    \nEstos son algunos ejemplos válidos:
    \nen el Formato natural puedes usar: "Agregar proveedor Ferretería Moderna, contacto Juan Pérez, teléfono 5551234567, email juan@ferreteria.com" 

    \no para mayor presicion usa el Formato tecnico : "Ferretería Moderna, Juan Pérez, 5551234567, juan@ferreteria.com"
    \nrecuerda que en el tecnico puedes usar comas para separar los datos, y en el natural puedes usar palabras como "Agregar proveedor" para iniciar la conversación.
    \n(Escribe 'salir' para cancelar)

    `;
  }
  if (text.toLowerCase() === "ver historial") {
    // Retorna el historial como una respuesta
    const historialLimitado = historialConversacion.slice(-5);
    return `Historial de la conversación:\n${historialLimitado.join('\n')}`;
  }
  if (text.toLowerCase() === "limpiar historial") {
    // Limpia el historial
    historialConversacion = []; 
    return "Historial de la conversación limpiado.";
  }  

  // Manejo de búsqueda de productos
 // Cuando el usuario menciona que quiere buscar un producto
 if (text.toLowerCase().includes("buscar producto")) {
  // Establecer estado para esperar el ID
  contextoBusqueda = "esperando_id";
  return "🔍 Por favor ingresa el ID numérico del producto que deseas buscar:";
}

// Detecta si el usuario proporciona un ID numérico
if (/^\d+$/.test(text) && contextoBusqueda === "esperando_id") {
  contextoBusqueda = null; // Restablecer estado
  return await buscarProducto({ id: text }, db);

  
}  if (text.toLowerCase().includes("eliminar producto")) {
  contextoBusqueda = "eliminar_esperando_id";
  return "🗑️ Por favor ingresa el ID numérico del producto que deseas ELIMINAR:";
}

// Confirmación de eliminación (si ya se proporcionó el ID)
if (text.toLowerCase() === "si" && contextoBusqueda?.startsWith("confirmar_eliminar_")) {
  const id = contextoBusqueda.split("_")[2]; // Extrae el ID del contexto
  contextoBusqueda = null;
  return await eliminarProducto({ id }, db);
}

// Si el usuario escribe "no" al confirmar
if (text.toLowerCase() === "no" && contextoBusqueda?.startsWith("confirmar_eliminar_")) {
  const id = contextoBusqueda.split("_")[2];
  contextoBusqueda = null;
  return "🚫 Eliminación cancelada.";
}

// Si envía un ID numérico y está en modo eliminación
if (/^\d+$/.test(text) && contextoBusqueda === "eliminar_esperando_id") {
  contextoBusqueda = `confirmar_eliminar_${text}`; // Guarda el ID en el contexto
  return `⚠️ ¿Estás SEGURO que quieres eliminar el producto con ID ${text}? (Responde "si" o "no")`;
}

// Si envía un número sin contexto



  // Manejo de modificación de productos
  if (text === "modificar producto") {
    return "Por favor proporciona el ID del producto que deseas modificar y los campos que deseas actualizar";
  }

  if (text === "SUBMIT_MODIFICAR_PRODUCTO_DATA") {
    return await modificarProducto(queryData);
  }



  // Manejo de búsqueda de proveedores
// Manejo de búsqueda de proveedores
if (text.toLowerCase().includes("buscar proveedor")) {
  contextoBusqueda = "esperando_id_proveedor";
  return "🔍 Por favor ingresa el ID numérico del proveedor que deseas buscar:";
}

// Detecta si el usuario proporciona un ID numérico para proveedor
if (/^\d+$/.test(text) && contextoBusqueda === "esperando_id_proveedor") {
  contextoBusqueda = null; // Restablecer estado
  return await buscarProveedor({ id: text }, db);
}

  // Manejo de modificación de proveedores


  // Manejo de eliminación de proveedores
  if (text === "eliminar proveedor") {

    return "Por favor proporciona el ID del proveedor que deseas eliminar";
    

  }

  if (text === "SUBMIT_ELIMINAR_PROVEEDOR_DATA") {
    return await eliminarProveedor(queryData);
  }

  // Si no es una operación CRUD, continuar con la predicción normal
  const inputTensor = textToTensor(text);
  const prediction = model.predict(inputTensor);

  // registrarIgnorancia(text, prediction);
// O si no quieres guardar y solo ver en consola:
const data = prediction.dataSync();
const maxProb = Math.max(...data);

if (maxProb < 0.9) { // Puedes ajustar el umbral
  registrarIgnorancia(text, prediction); // Guardar en el caos

  if (caos.length > 10) {
    caos.shift(); // Mantener solo los últimos 10 registros
  }
}



  const predictedClass = prediction.argMax(1).dataSync()[0];
  const response = trainingData[predictedClass].output;

  const respuestasFinales = [
    "✅ Producto registrado exitosamente",
    "✅ Proveedor registrado exitosamente",
    "Hubo un error al registrar el producto. Por favor verifica los datos e intenta nuevamente.",
    "Hubo un error al registrar el proveedor. Por favor verifica los datos e intenta nuevamente."
  ];
  if (respuestasFinales.includes(text)) {
    return null; // No responder nada, o puedes devolver simplemente el mismo texto
  }

  if (typeof response === 'function') {
    return await response(db);
  }
  return response;
}

// Evitar procesar respuestas finales como inputs nuevos




module.exports = {
  createModel,
  trainModel,
  textToTensor,
  predictResponse,
  generateReport,
  agregarProducto,
  buscarProducto,
  modificarProducto,
  eliminarProducto,
  agregarProveedor,
  buscarProveedor,

  eliminarProveedor,
  trainingData
};