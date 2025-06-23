const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking API",
      version: "1.0.0",
      description: "API documentation for the Booking application",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/app/api/**/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

const outputPath = path.join(__dirname, "swagger.json");
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));

console.log(`Swagger docs generated at ${outputPath}`);
console.log(`Swagger docs available at http://localhost:4000/api-docs`);
