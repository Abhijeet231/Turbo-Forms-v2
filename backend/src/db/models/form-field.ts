import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    integer,
    json,
    timestamp,
    pgEnum,
    index,
    unique,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form.js";

export const fieldTypeEnum = pgEnum("field_type", [
    "short_text",
    "long_text",
    "email",
    "number",
    "date",
    "single_select",// radio buttons
    "multi_select", // checkboxes (pick many)
    "dropdown",     // <select>
    "rating",       // star rating 1–5
    "boolean",
]);

// Stored in form_fields.options JSON column
export interface FieldOption {
    label: string;
    value: string; // what gets stored in submission_answers.value
}

// Stored in form_fields.validations JSON column
export interface FieldValidation {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    minSelections?: number;
    maxSelections?: number;
    minRating?: number;
    maxRating?: number;
}

export const formFieldsTable = pgTable(
    "form_fields",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        formId: uuid("form_id")
            .references(() => formsTable.id, { onDelete: "cascade" })
            .notNull(),

        type: fieldTypeEnum("type").notNull(),

        label: varchar("label", { length: 200 }).notNull(),


        labelKey: varchar("label_key", { length: 200 }).notNull(), // generate it with each field creation.

        description: text("description"),
        placeholder: text("placeholder"),

        isRequired: boolean("is_required").default(false).notNull(),


        displayOrder: varchar("display_order", { length: 50 }).notNull(),

        // only populated for single_select, multi_select, dropdown
        options: json("options").$type<FieldOption[]>(),

        // validation rules beyond "required"
        validations: json("validations").$type<FieldValidation>(),

        defaultValue: text("default_value"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (table) => [
        // form renderer: "get all fields for form X, ordered"
        index("idx_form_fields_form_id").on(table.formId),

        // no two fields can have the same order within a form
        unique("uq_form_fields_order").on(table.formId, table.displayOrder),

        // no two fields can have the same labelKey within a form
        unique("uq_form_fields_label_key").on(table.formId, table.labelKey),
    ]
);

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;