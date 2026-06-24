import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    jsonb,
    timestamp,
    integer,
    pgEnum,
    index,
    unique,
} from "drizzle-orm/pg-core";
import { formsTable } from "./forms.model.js";

export const fieldTypeEnum = pgEnum("field_type", [
    "short_text",
    "long_text",
    "email",
    "number",
    "single_select",
    "multi_select",
    "dropdown",
    "rating",
    "date",
    "boolean",
]);

// shape of each option for select/dropdown fields
export interface FieldOption {
    label: string;
    value: string;
}

// shape of validation rules stored in jsonb
export interface FieldValidation {
    minLength?: number;       // short_text, long_text
    maxLength?: number;       // short_text, long_text
    min?: number;             // number
    max?: number;             // number
    pattern?: string;         // regex string for text fields
    minSelections?: number;   // multi_select
    maxSelections?: number;   // multi_select
    minRating?: number;       // rating
    maxRating?: number;       // rating
}

export const formFieldsTable = pgTable(
    "form_fields",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        form_id: uuid("form_id")
            .references(() => formsTable.id, { onDelete: "cascade" })
            .notNull(),

        type: fieldTypeEnum("type").notNull(),

        label: varchar("label", { length: 255 }).notNull(),

        // stable programmatic key, auto-generated from label
        // e.g. "What is your job title?" → "what_is_your_job_title"
        // used for conditional logic references, not UUIDs
        field_key: varchar("field_key", { length: 255 }).notNull(),

        placeholder: varchar("placeholder", { length: 255 }),
        help_text: text("help_text"),

        is_required: boolean("is_required").default(false).notNull(),
        order: varchar("order", { length: 50 }).notNull(),

        options: jsonb("options").$type<FieldOption[]>().default([]).notNull(),
        validations: jsonb("validations").$type<FieldValidation>().default({}).notNull(),

        created_at: timestamp("created_at").defaultNow().notNull(),
        updated_at: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
    }
);

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;