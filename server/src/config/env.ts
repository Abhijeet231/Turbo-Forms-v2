import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().describe("DB URL"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().describe("Port to run the server on"),
  CORS_ORIGIN: z.string().describe("Origin for CORS"),

});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);