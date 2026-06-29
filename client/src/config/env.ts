import { z } from "zod"

const evnSchema = z.object({
    VITE_API_BASE_URL: z.url(),
    VITE_CLERK_PUBLISHABLE_KEY: z.string()
});

const parsedEnv = evnSchema.safeParse(import.meta.env);

if(!parsedEnv.success) {
    console.error(parsedEnv.error.message);
    throw new Error("Invalid environment variable")
}

export const env = parsedEnv.data;