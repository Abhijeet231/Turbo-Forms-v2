import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../config/env.js"

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
        url: env.NODE_ENV === "production"
          ? "https://your-production-url.com"
          : "http://localhost:3000",
        description: env.NODE_ENV === "production"
          ? "Production server"
          : "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            fullName: { type: "string" },
            email: { type: "string", format: "email" },
            profileImageUrl: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "object" },
          },
        },
      },
    },
  },
  apis: [
    "./src/modules/**/*.ts",
    "./dist/modules/**/*.js",
  ],
});