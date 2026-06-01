import { db } from "../../db/index.js";
import { formsTable } from "../../db/models/form.js";
import { eq } from "drizzle-orm";

interface OwnershipResult {
    authorized: boolean;
    status: 404 | 403 | null;
    message: string | null;
}

/**
 * Verifies a form exists and the requesting user owns it.
 * Returns { authorized: true } on success, or a status + message on failure.
 *
 * Usage:
 *   const check = await verifyFormOwnership(formId, userId);
 *   if (!check.authorized) return res.status(check.status!).json(...)
 */
export const verifyFormOwnership = async (
    formId: string,
    userId: string
): Promise<OwnershipResult> => {
    const [form] = await db
        .select({ createdBy: formsTable.createdBy })
        .from(formsTable)
        .where(eq(formsTable.id, formId))
        .limit(1);

    if (!form) {
        return { authorized: false, status: 404, message: "Form not found" };
    }

    if (form.createdBy !== userId) {
        return { authorized: false, status: 403, message: "You do not have access to this form" };
    }

    return { authorized: true, status: null, message: null };
};