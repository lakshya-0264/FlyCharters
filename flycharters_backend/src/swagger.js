import swaggerJsdoc from "swagger-jsdoc";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Node.js Express API',
      version: '1.0.0',
      description: 'API Documentation',
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server"
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
  },
  apis: [
    path.join(__dirname, './Routers/**/*.js'),
  ],
};
const specs = swaggerJsdoc(options);
//console.log("Swagger paths found:", Object.keys(specs.paths));
///console.log("First path example:", specs.paths[Object.keys(specs.paths)[0]]);
export { specs };