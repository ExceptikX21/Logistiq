// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API LogistIQ',
    version: '1.0.0',
    description: 'Documentación del sistema de inventario LogistIQ',
  },
  servers: [
    {
      url: 'https://192.168.0.14:443',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    
      },
    },
  },
  
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './index.js'], // o './app.js', según como se llame tu archivo principal

};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
