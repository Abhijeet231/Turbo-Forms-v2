import { formsTable, formFieldsTable } from "../../db/schema.js";
import { db } from "../../db/index.js"
import { and, asc, desc, eq } from "drizzle-orm";
import { getDbUserByClerkId } from "../user/user.service.js";
import { generateKeyBetween } from "fractional-indexing"
import type {
    CreateFieldInput,
    UpdateFieldInput,
    ReorderFieldInput
} from "./form-field.validation.js";
import type { FieldSummary } from "./form-field.types.js"

import { generateFieldKey, getUniqueFieldKey, getLastOrder, verifyFormOwnership } from "./helper.js";



// *** Create form filed ***
export const createFieldService = async (clerkId: string, formId: string, data: CreateFieldInput): Promise<FieldSummary> => {

    // resolve clerk id > db user id
    const dbUser = await getDbUserByClerkId(clerkId);

    // confirm form exists and belong to this guy
    await verifyFormOwnership(formId, dbUser.id);

    // generate filed key from label
    const baseKey = generateFieldKey(data.label)
    const fieldKey = await getUniqueFieldKey(formId, baseKey);

    // fractional indexing stuff
    const lastOrder = await getLastOrder(formId);
    const order = generateKeyBetween(lastOrder, null)

    // insert filed and return
    const [field] = await db
        .insert(formFieldsTable)
        .values({
            form_id: formId,
            type: data.type,
            label: data.label,
            field_key: fieldKey,
            placeholder: data.placeholder ?? null,
            help_text: data.help_text ?? null,
            is_required: data.is_required,
            order,
            options: data.options ?? [],
            validations: data.validations ?? {}
        })
        .returning()

    return field!

}

// *** Get all fileds for a form *** 
export async function getFieldsService(clerkId: string, formId: string): Promise<FieldSummary[]> {

    const dbUser = await getDbUserByClerkId(clerkId);
    await verifyFormOwnership(formId, dbUser.id)

    const fileds = await db.select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.form_id, formId))
        .orderBy(asc(formFieldsTable.order))

    return fileds;

}

// *** Update Filed ***
export async function updateFiledService(clerkId: string, formId: string, fieldId: string, data: UpdateFieldInput): Promise<FieldSummary> {

    const dbUser = await getDbUserByClerkId(clerkId);
    await verifyFormOwnership(formId, dbUser.id);

    // fetch the existing field — needed to:
    // (a) confirm it exists and belongs to this form
    // (b) get the current type to validate incoming validations against it
    const existing = await db.select()
        .from(formFieldsTable)
        .where(and(
            eq(formFieldsTable.id, fieldId),
            eq(formFieldsTable.form_id, formId)
        ))
        .limit(1)

    if (existing.length === 0) {
        throw new Error("Field not found or unauthorized")
    }

    const existingField = existing[0]!;

    // NEW: validate options against the stored type — same reason as validations below,
    // updateFieldSchema doesn't receive `type` from the client so Zod can't check this

    if (data.options !== undefined) {
        const OPTION_TYPES = new Set(["single_select", "multi_select", "dropdown"]);
        const type = existingField.type;

        if (OPTION_TYPES.has(type)) {
            if (data.options.length === 0) {
                throw new Error(`options cannot be emptied for field type "${type}"`);
            }
        } else {
            if (data.options.length > 0) {
                throw new Error(`options are not allowed for field type "${type}"`);
            }
        }
    }


    // if new validations are coming in, check them against the stored type
    // this is the check we couldn't do in the Zod schema because updateFieldSchema
    // doesn't receive `type` from the client

    if (data.validations) {
        const v = data.validations;
        const type = existingField.type;

        const TEXT_TYPES = new Set(["short_text", "long_text", "email"]);
        const NUMBER_TYPES = new Set(["number"]);
        const RATING_TYPES = new Set(["rating"]);
        const SELECT_TYPES = new Set(["multi_select"]);

        const hasTextValidations = v.minLength !== undefined || v.maxLength !== undefined || v.pattern !== undefined;
        const hasNumberValidations = v.min !== undefined || v.max !== undefined;
        const hasRatingValidations = v.minRating !== undefined || v.maxRating !== undefined;
        const hasSelectValidations = v.minSelections !== undefined || v.maxSelections !== undefined;

        if (hasTextValidations && !TEXT_TYPES.has(type)) {
            throw new Error(`minLength, maxLength, pattern are not valid for field type "${type}"`);
        }
        if (hasNumberValidations && !NUMBER_TYPES.has(type)) {
            throw new Error(`min and max are not valid for field type "${type}"`);
        }
        if (hasRatingValidations && !RATING_TYPES.has(type)) {
            throw new Error(`minRating and maxRating are not valid for field type "${type}"`);
        }
        if (hasSelectValidations && !SELECT_TYPES.has(type)) {
            throw new Error(`minSelections and maxSelections are not valid for field type "${type}"`);
        }
    }


    // if label is changing, regenerate field_key
    let fieldKey = existingField.field_key;
    if (data.label && data.label !== existingField.label) {
        const baseKey = generateFieldKey(data.label);
        fieldKey = await getUniqueFieldKey(formId, baseKey);
    }

    const [updated] = await db
        .update(formFieldsTable)
        .set({
            ...(data.label !== undefined && { label: data.label, field_key: fieldKey }),
            ...(data.placeholder !== undefined && { placeholder: data.placeholder }),
            ...(data.help_text !== undefined && { help_text: data.help_text }),
            ...(data.is_required !== undefined && { is_required: data.is_required }),
            ...(data.options !== undefined && { options: data.options }),
            ...(data.validations !== undefined && { validations: data.validations }),
        })
        .where(
            and(
                eq(formFieldsTable.id, fieldId),
                eq(formFieldsTable.form_id, formId)
            )
        )
        .returning();

    return updated!;

}


// *** Delete Field ***
export async function deleteFieldService(
    clerkId: string,
    formId: string,
    fieldId: string
): Promise<{ message: string }> {

    const dbUser = await getDbUserByClerkId(clerkId);
    await verifyFormOwnership(formId, dbUser.id);

    const deleted = await db
        .delete(formFieldsTable)
        .where(
            and(
                eq(formFieldsTable.id, fieldId),
                eq(formFieldsTable.form_id, formId)
            )
        )
        .returning({ id: formFieldsTable.id });

    if (deleted.length === 0) {
        throw new Error("Field not found or unauthorized");
    }

    return { message: "Field deleted successfully" };
}


// *** Reorder fileds ***
export async function reorderFieldService(
    clerkId: string,
    formId: string,
    data: ReorderFieldInput,
    fieldId: string
): Promise<FieldSummary> {

    const dbUser = await getDbUserByClerkId(clerkId);
    await verifyFormOwnership(formId, dbUser.id);

    // confirm the field being reordered actually belongs to this form
    const existing = await db
        .select()
        .from(formFieldsTable)
        .where(
            and(
                eq(formFieldsTable.id, fieldId),
                eq(formFieldsTable.form_id, formId)
            )
        )
        .limit(1);

    if (existing.length === 0) {
        throw new Error("Field not found or unauthorized");
    }

    // compute the new fractional key from the two neighbours
    // prevOrder = null means "before the first item"
    // nextOrder = null means "after the last item"
    const newOrder = generateKeyBetween(data.prevOrder, data.nextOrder);

    const [updated] = await db
        .update(formFieldsTable)
        .set({ order: newOrder })
        .where(
            and(
                eq(formFieldsTable.id, fieldId),
                eq(formFieldsTable.form_id, formId)
            )
        )
        .returning();

    return updated!;
}
