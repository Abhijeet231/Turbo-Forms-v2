import { formsTable } from "../../db/schema.js";
import { usersTable } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, count, and, desc } from "drizzle-orm";
import { type CreateFormInput, type UpdateFormInput } from "./form.validation.js"
import { getDbUserByClerkId } from "../user/user.service.js"


// GENERATE SLUG
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

// CREATE FORM
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

// UPDATE FORM (handles visibility as well)
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
// GET ALL FORMS FOR LOGGED IN CREATORS
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

// GET SINGLE FORM BY FORMID 
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

// DELETE FORM
export const deleteFormService = async (userId: string, formId: string) => {

    const user = await getDbUserByClerkId(userId)

    // check ownership
    const form = await db.select()
        .from(formsTable)
        .where(and(
            eq(formsTable.id, formId),
            eq(formsTable.user_id, user.id)
        ))
        .limit(1);

    if (!form[0]) throw new Error("Form not found or unauthorized")

    // delte form
    await db.delete(formsTable).where(eq(formsTable.id, formId))

}

// SET FORM STATUS
export const setFormPublishStatusService = async (userId: string, formId: string, status: boolean) => {

    // get user from DB
    const user = await getDbUserByClerkId(userId)

    // check ownership
    const form = await db.select()
        .from(formsTable)
        .where(
            and(
                eq(formsTable.id, formId),
                eq(formsTable.user_id, user.id)
            )
        )
        .limit(1)

    if (!form[0]) throw new Error("Form not found or unauthorized")

    // guard rails before publishing form
    if (status === true && form[0].visibility !== "public") {
        throw new Error("Form must be set to public before publishing")
    };

    if (status === true && form[0].is_published === true) {
        throw new Error("Form is already published")
    };

    if (status === false && form[0].is_published === false) {
        throw new Error("Form is already unpublished")
    };

    //update form publish status
    const result = await db.update(formsTable)
        .set({
            is_published: status
        })
        .where(eq(formsTable.id, formId))
        .returning()

    // return response
    return result[0]

}

// GET ALL PUBLIC FORM
export const getAllPublicFormsService = async () => {

    // find all forms whose ispublished status is true
    const forms = await db.select()
        .from(formsTable)
        .where(and(
            eq(formsTable.is_published, true),
            eq(formsTable.visibility, "public")
        ))
        .orderBy(desc(formsTable.created_at))

    return forms;

    // later sort forms according to view count - higher view count - show first


}

// GET SINGLE FORM PUBLIC (with slug)
export const getFormBySlugService = async (slug: string) => {

    const result = await db.select()
        .from(formsTable)
        .where(and(
            eq(formsTable.slug, slug),
            eq(formsTable.is_published, true),
            eq(formsTable.visibility, "public")
        ))
        .limit(1);

    if (!result[0]) throw new Error("Form not found or unavailable")

    return result[0] 

}