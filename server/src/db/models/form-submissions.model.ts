import {
    pgTable,
    uuid,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";
import { formsTable } from "./forms.model.js";

export const formSubmissionsTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    form_id: uuid("form_id")
        .references(() => formsTable.id, { onDelete: "cascade" })
        .notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
});

export type SelectFormSubmission = typeof formSubmissionsTable.$inferSelect;
export type InsertFormSubmission = typeof formSubmissionsTable.$inferInsert;