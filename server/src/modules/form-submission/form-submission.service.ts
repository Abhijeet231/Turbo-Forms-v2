import {
    formSubmissionsTable,
    submissionAnswersTable,
    formsTable,
    formFieldsTable,
    usersTable
} from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import { getDbUserByClerkId } from "../user/user.service.js";
import type { SubmitFormInput } from "./form-submission.validation.js";
import type { SelectFormField, SelectFormSubmission } from "../../db/schema.js";
import type { SubmissionWithAnswers } from "./form-submission.types.js";
import { validateAnswerValue } from "./answer-validator.js"


// ** SUbmit Form ** /api/forms/:formId/submit

export const submitFormService = async (formId: string, data: SubmitFormInput): Promise<SelectFormSubmission> => {

    // check if form exists and if it's published or not
    const form = await db.select()
        .from(formsTable)
        .where(eq(formsTable.id, formId))
        .limit(1)

    if (form.length === 0) {
        throw new Error("Form not found or unavailable");
    }

    if (!form[0]!.is_published) {
        throw new Error("Form is not accepting submissions");
    }

    // fetch all fileds for this form
    const fields = await db.select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.form_id, formId));

    if (fields.length === 0) {
        throw new Error("Form has no fields");
    }

    // check fr duplicate field_id in the submitted asnswer ( goal is to avoid two answers for the smae filed)
    const submittedFieldIds = data.answers.map((a) => a.field_id);
    const uniqueFieldIds = new Set(submittedFieldIds);
    if (uniqueFieldIds.size !== submittedFieldIds.length) {
        throw new Error("Duplicate field_ids in answers");
    }

    // check for no answer reference a filed that doesn't belong to this form
    const validFieldIds = new Set(fields.map((f) => f.id));
    for (const answer of data.answers) {
        if (!validFieldIds.has(answer.field_id)) {
            throw new Error(`Field "${answer.field_id}" does not belong to this form`);
        }
    }

    // build a mpa for filed lookups in the next two checks 
    const fieldMap = new Map(fields.map((f) => [f.id, f]));

    // check all required fields have an answer
    const answeredFieldIds = new Set(data.answers.map((a) => a.field_id));
    for (const field of fields) {
        if (field.is_required && !answeredFieldIds.has(field.id)) {
            throw new Error(`"${field.label}" is required`);
        }
    }

    //  validate each answer value against its field's type and validation rules
    const validationErrors: string[] = [];
    for (const answer of data.answers) {
        const field = fieldMap.get(answer.field_id)!;
        const error = validateAnswerValue(answer.value, field);
        if (error) validationErrors.push(error);
    }

    if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
    }


    //  all checks passed - insert submission row first, then all answers
    //   used  a transaction so if answers insert fails, the submission row

    const result = await db.transaction(async (tx) => {
        const [submission] = await tx
            .insert(formSubmissionsTable)
            .values({ form_id: formId })
            .returning();

        await tx.insert(submissionAnswersTable).values(
            data.answers.map((answer) => ({
                submission_id: submission!.id,
                field_id: answer.field_id,
                value: answer.value,
            }))
        );

        return submission!;
    });

    return result;

}