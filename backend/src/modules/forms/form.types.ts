import type { SelectForm } from "../../db/models/form.js";

// ─── API Response Shapes ───────────────────────────────────

export type FormSummary = Pick<
    SelectForm,
    | "id"
    | "title"
    | "description"
    | "slug"
    | "isPublished"
    | "visibility"
    | "theme"
    | "viewCount"
    | "submissionCount"
    | "createdAt"
    | "updatedAt"
>;

export type FormDetail = SelectForm;

// ─── Controller Response Wrappers ─────────────────────────

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