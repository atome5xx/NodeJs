// config/swaggerConfig.js

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API pour gérer l\'authentification et les utilisateurs',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  //apis: ['./../routes/*.js'], // Assurez-vous que ce chemin est correct
  apis: ['./routes/*.js'], // Assurez-vous que ce chemin est correct

};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpecs;
