import { usersTable, type InsertUser } from "../../db/schema.js";
import { db } from "../../db/index.js"
import { eq } from "drizzle-orm";


// get user from clerk
export const getUserByClerkId = async (clerkId: string) => {
    const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerk_id, clerkId))
        .limit(1);

    return result[0] ?? null;
}

// create new user
export const createUser = async (data: InsertUser) => {
    const result = await db.insert(usersTable)
        .values(data)
        .returning();

    return result[0] ?? null;
}
