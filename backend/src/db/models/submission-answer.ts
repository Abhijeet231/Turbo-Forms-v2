import {
    pgTable,
    uuid,
    text,
    timestamp,
    index,
} from "drizzle-orm/pg-core";
import { formSubmissionsTable } from "./form-submission.js";
import { formFieldsTable } from "./form-field.js";

export const submissionAnswersTable = pgTable(
    "submission_answers",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        submissionId: uuid("submission_id")
            .references(() => formSubmissionsTable.id, { onDelete: "cascade" })
            .notNull(),

        fieldId: uuid("field_id")
            .references(() => formFieldsTable.id, { onDelete: "cascade" })
            .notNull(),

        value: text("value"),


        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        // fetch all answers for a submission (response detail view)
        index("idx_answers_submission_id").on(table.submissionId),

        // analytics: "all answers for field X" (field-level stats)
        index("idx_answers_field_id").on(table.fieldId),
    ]
);

export type SelectSubmissionAnswer = typeof submissionAnswersTable.$inferSelect;
export type InsertSubmissionAnswer = typeof submissionAnswersTable.$inferInsert;