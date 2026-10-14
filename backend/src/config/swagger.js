const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alumni API',
      version: '1.0.0',
      description: 'Alumni Tracking System RESTful API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development Server',
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
