import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form.js";

export const formSubmissionsTable = pgTable(
  "form_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id")
      .references(() => formsTable.id, { onDelete: "cascade" })
      .notNull(),

    // for spam/rate-limit tracking — store raw, never expose
    ipAddress: varchar("ip_address", { length: 45 }), // supports IPv6

    userAgent: text("user_agent"),

    submittedAt: timestamp("submitted_at").defaultNow().notNull(),

  },
  (table) => [
    // analytics: "all submissions for form X"
    index("idx_submissions_form_id").on(table.formId),

    // rate limiting: "how many submissions from this IP on this form recently"
    index("idx_submissions_rate_limit").on(
      table.formId,
      table.ipAddress,
      table.submittedAt
    ),
  ]
);

export type SelectFormSubmission = typeof formSubmissionsTable.$inferSelect;
export type InsertFormSubmission = typeof formSubmissionsTable.$inferInsert;