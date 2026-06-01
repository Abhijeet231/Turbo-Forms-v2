import type { SelectFormField } from "../../db/models/form-field.js";

// ─── Field Response Shapes ─────────────────────────────────

export type FieldSummary = Pick<
    SelectFormField,
    | "id"
    | "formId"
    | "type"
    | "label"
    | "labelKey"
    | "description"
    | "placeholder"
    | "isRequired"
    | "displayOrder"
    | "options"
    | "validations"
    | "defaultValue"
>;

export type FieldDetail = SelectFormField;

// ─── Reorder Input ─────────────────────────────────────────

export interface ReorderInput {
    prevOrder: string | null;
    nextOrder: string | null;
}

// ─── API Response Wrappers ─────────────────────────────────

export interface ApiSuccess<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}