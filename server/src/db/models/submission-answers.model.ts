import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { formSubmissionsTable } from "./form-submissions.model.js";
import { formFieldsTable } from "./form-fields.model.js";

export const submissionAnswersTable = pgTable("submission_answers", {
    id: uuid("id").primaryKey().defaultRandom(),

    submission_id: uuid("submission_id")
        .references(() => formSubmissionsTable.id, { onDelete: "cascade" })
        .notNull(),

    field_id: uuid("field_id")
        .references(() => formFieldsTable.id, { onDelete: "cascade" })
        .notNull(),

    value: text("value").notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
});

export type SelectSubmissionAnswer = typeof submissionAnswersTable.$inferSelect;
export type InsertSubmissionAnswer = typeof submissionAnswersTable.$inferInsert;
