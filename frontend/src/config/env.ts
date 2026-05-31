import {z} from "zod"

const envSchema = z.object({
    VITE_API_BASE_URL: z.url(),

});

const parsedEnv = envSchema.safeParse(import.meta.env);

if(!parsedEnv.success) {
    console.error(parsedEnv.error.message);
    throw new Error("Invalid environment variables")
}

export const env = parsedEnv.data;