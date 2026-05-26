import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().describe("DB URL"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().describe("Port to run the server on"),
  CORS_ORIGIN: z.string().describe("Origin for CORS"),
  BASE_URL: z.string().describe("Origin for the base_url"),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),

  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);