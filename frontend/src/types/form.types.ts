export type FormVisibility = "public" | "unlisted";

export type FormTheme = string;

// Shape of a form returned from the API
export interface Form {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    createdBy: string;
    theme: FormTheme | null;
    isPublished: boolean;
    visibility: FormVisibility;
    successMessage: string | null;
    viewCount: number;
    submissionCount: number;
    createdAt: string;
    updatedAt: string;
}

// POST /api/forms
export interface CreateFormPayload {
    title: string;
    description?: string;
}

// PATCH /api/forms/:formId/publish
export interface PublishFormPayload {
    visibility: FormVisibility;
}

// API response wrappers
export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

// Specific response types
export type CreateFormResponse = ApiSuccess<{ form: Form }>;
export type GetFormsResponse = ApiSuccess<{ forms: Form[] }>;
export type GetFormByIdResponse = ApiSuccess<{ form: Form }>;
export type PublishFormResponse = ApiSuccess<{ form: Form }>;
export type UnpublishFormResponse = ApiSuccess<{ form: Form }>;