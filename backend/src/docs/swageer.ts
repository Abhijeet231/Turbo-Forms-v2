import swaggerJSDoc from "swagger-jsdoc";
import {env} from "../config/env.js"

export const openApiSpecification = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "TurboForm API",
      version: "1.0.0",
      description: "API documentation for the backend",
    },

    servers: [
      {
        url: env.BASE_URL,
      },
    ],
  },

  apis: ["./src/modules/**/*.ts"],
});