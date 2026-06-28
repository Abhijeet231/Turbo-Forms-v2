import { formFieldsTable, formsTable } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, desc, and } from "drizzle-orm";

// Generate field_key
export function generateFieldKey(label: string): string {
    return label
        .toLocaleLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .slice(0, 190)
}

// If "name" already exists, tries "name_1", "name_2", etc.
export async function getUniqueFieldKey(formId: string, baseKey: string): Promise<string> {
    const existing = await db
        .select({ field_key: formFieldsTable.field_key })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.form_id, formId));

    const existingKeys = new Set(existing.map((f) => f.field_key));

    if (!existingKeys.has(baseKey)) return baseKey;

    let suffix = 1;
    while (existingKeys.has(`${baseKey}_${suffix}`)) {
        suffix++;
    }
    return `${baseKey}_${suffix}`;
}


// Get the order key of the last filed in the form. Return Null if no fileds yet.
export async function getLastOrder(formId: string): Promise<string | null> {
    const result = await db
        .select({ order: formFieldsTable.order })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.form_id, formId))
        .orderBy(desc(formFieldsTable))
        .limit(1);

    return result[0]?.order ?? null;
}

// Verify the form exists and belongs to this user.
export async function verifyFormOwnership(formId: string, dbUserId: string): Promise<void> {
    const form = await db
        .select({ id: formsTable.id })
        .from(formsTable)
        .where(
            and(
                eq(formsTable.id, formId),
                eq(formsTable.user_id, dbUserId)
            )
        )
        .limit(1);

    if (form.length === 0) {
        throw new Error("Form not found or unauthorized")
    }
}

