import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    jsonb,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.model.js";

export const visibilityEnum = pgEnum("visibility", ["public", "unlisted"]);

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    user_id: uuid("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    slug: varchar("slug", { length: 255 }).notNull().unique(),

    visibility: visibilityEnum("visibility").default("unlisted").notNull(),

    is_published: boolean("is_published").default(false).notNull(),

    theme: jsonb("theme").default({}).notNull(),
    settings: jsonb("settings").default({}).notNull(), // submission limit and expiry

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;