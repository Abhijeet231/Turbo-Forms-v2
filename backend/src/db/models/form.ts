import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    integer,
    timestamp,
    pgEnum,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.js"

export const formVisibilityEnum = pgEnum("form_visibility", [
    "public",
    "unlisted",
]);

export const formsTable = pgTable(
    "forms",
    {
        id: uuid("id").primaryKey().defaultRandom(),


        title: varchar("title", { length: 100 }).notNull(),
        description: text("description"),


        slug: varchar("slug", { length: 120 }).notNull(),


        createdBy: uuid("created_by")
            .references(() => usersTable.id, { onDelete: "cascade" })
            .notNull(),


        theme: varchar("theme", { length: 50 }).default("default").notNull(),

        isPublished: boolean("is_published").default(false).notNull(),
        visibility: formVisibilityEnum("visibility").default("unlisted").notNull(),


        successMessage: text("success_message").default(
            "Thank you for your response!"
        ),


        viewCount: integer("view_count").default(0).notNull(),
        submissionCount: integer("submission_count").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (table) => [
        // dashboard: "show me all forms by user X"
        index("idx_forms_created_by").on(table.createdBy),

        // explore page: "show me all public + published forms"
        index("idx_forms_visibility_published").on(
            table.visibility,
            table.isPublished
        ),

        // slug must be globally unique (share URL)
        uniqueIndex("idx_forms_slug").on(table.slug),
    ]
);

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;