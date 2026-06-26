import { formsTable } from "../../db/schema.js";
import { usersTable } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, count, and, desc } from "drizzle-orm";
import { type CreateFormInput, type UpdateFormInput } from "./form.validation.js"
import { getDbUserByClerkId } from "../user/user.service.js"


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
    const user = await getDbUserByClerkId(userId)
    if (!user) {
        throw new Error("user not found")
    }

    // check ownership
    const existingForm = await db.select()
        .from(formsTable)
        .where(and(
            eq(formsTable.id, formId),
            eq(formsTable.user_id, user.id)
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

// Get all froms for logged In creator
export const getAllFormsService = async (userId: string) => {

    // get the user from the DB using clerkId
    const user = await getDbUserByClerkId(userId);

    if (!user) {
        throw new Error("user not found")
    }


    // fetch all forms where form.userId = user.id
    const allForms = await db.select()
        .from(formsTable)
        .where(eq(formsTable.user_id, user.id))
        .orderBy(desc(formsTable.created_at))

    // return back

    return {
        forms: allForms,
        count: allForms.length
    }

}

// Get single form by formId
export const getFormByIdForCreatorService = async (userId: string, formId: string) => {
    const user = await getDbUserByClerkId(userId);

    const result = await db.select()
        .from(formsTable)
        .where(and(
            eq(formsTable.id, formId),
            eq(formsTable.user_id, user.id)
        ))
        .limit(1)

    if (!result[0]) throw new Error("Form not found or unauthorized")

    return result[0]

}