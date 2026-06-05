import type { FormField } from "./form-fields.types";
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

// Form with its fields - used in preview + public view
export interface FormWithFields extends Form {
    fields: FormField[];
    isPreview: boolean;
}


// Specific response types
export type CreateFormResponse = ApiSuccess<{ form: Form }>;
export type GetFormsResponse = ApiSuccess<Form[]>;
export type GetFormByIdResponse = ApiSuccess<Form>;
export type PublishFormResponse = ApiSuccess<{ form: Form }>;
export type UnpublishFormResponse = ApiSuccess<{ form: Form }>;

export type PreviewFormResponse = ApiSuccess<FormWithFields>;
export type GetPublicFormResponse = ApiSuccess<FormWithFields>;