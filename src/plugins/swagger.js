const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Domo API Documentation Test 04-03-2026',
      version: '1.0.2',
      description: 'ตัวอย่าง API พร้อมโครงสร้างที่สะอาด',
    },
   servers: [
      {
        url: '/', 
        description: 'Default Server (Dynamic)'
      }
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
  },
  // ระบุไฟล์ที่มีการเขียน Comment สำหรับ Swagger
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
