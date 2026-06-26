// types file — clean version for right now
import type { SelectFormField } from "../../db/schema.js";

export type FieldSummary = SelectFormField;  // what controllers return
export type FieldDetail  = SelectFormField;  // what services work with internally

export interface ReorderInput {
    prevOrder: string | null;
    nextOrder: string | null;
}