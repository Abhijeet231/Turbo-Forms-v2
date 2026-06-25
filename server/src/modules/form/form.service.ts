import { formsTable } from "../../db/schema.js";
import { usersTable } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, count, and } from "drizzle-orm";
import { type CreateFormInput, type UpdateFormInput } from "./form.validation.js"


// Generate Slug
function generateSlug(title: string): string {
    const base = title
        .toLocaleLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80);

    const suffix = Math.random().toString(36).slice(2, 6);

    return `${base}-${suffix}`
}

// Create Form
export const createFormService = async (userId: string, data: CreateFormInput) => {

    // find user 
    const user = await db.select()
        .from(usersTable)
        .where(eq(usersTable.clerk_id, userId))
        .limit(1);

    if (!user[0]) throw new Error("User not found");

    const slug = generateSlug(data.title)

    // create form
    const result = await db.insert(formsTable)
        .values({
            user_id: user[0].id,
            title: data.title,
            description: data.description ?? null,
            slug
        })
        .returning();

    return result[0] ?? null

}

// Update form
export const updateFormService = async (userId: string, formId: string, data: UpdateFormInput) => {


    // find the user in teh db
    const user = await db.select()
        .from(usersTable)
        .where(eq(usersTable.clerk_id, userId))
        .limit(1)

    if (!user[0]) throw new Error("User not foun")

    // check ownership
    const existingForm = await db.select()
        .from(formsTable)
        .where(and(
            eq(formsTable.id, formId),
            eq(formsTable.user_id, user[0].id)
        ))
        .limit(1)

    if (!existingForm[0]) throw new Error("Form not found or unauthorized")

    // update only the fields that were sent
    const result = await db.update(formsTable)
        .set({
            ...data,
            description: data.description ?? null
        })
        .where(eq(formsTable.id, formId))
        .returning()

    return result[0] ?? null;


}