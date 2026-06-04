export type FieldType =
    | "short_text"
    | "long_text"
    | "email"
    | "number"
    | "date"
    | "single_select"
    | "multi_select"
    | "dropdown"
    | "rating"
    | "boolean";

export interface FieldOption {
    label: string;
    value: string;
}

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

export interface FormField {
    id: string;
    formId: string;
    type: FieldType;
    label: string;
    labelKey: string;
    description: string | null;
    placeholder: string | null;
    isRequired: boolean;
    displayOrder: string;
    options: FieldOption[] | null;
    validations: FieldValidation | null;
    defaultValue: string | null;
    createdAt: string;
    updatedAt: string;
}

// POST /api/forms/:formId/fields
export interface CreateFieldPayload {
    type: FieldType;
    label: string;
    description?: string;
    placeholder?: string;
    isRequired?: boolean;
    options?: FieldOption[];
    validations?: FieldValidation;
    defaultValue?: string;
}

// PATCH /api/forms/:formId/fields/:fieldId
export interface UpdateFieldPayload {
    label?: string;
    description?: string;
    placeholder?: string;
    isRequired?: boolean;
    options?: FieldOption[];
    validations?: FieldValidation;
    defaultValue?: string;
}

// PATCH /api/forms/:formId/fields/:fieldId/reorder
export interface ReorderFieldPayload {
    prevOrder: string | null;
    nextOrder: string | null;
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
export type GetFieldsResponse = ApiSuccess<FormField[]>;
export type CreateFieldResponse = ApiSuccess<FormField>;
export type UpdateFieldResponse = ApiSuccess< FormField>;
export type DeleteFieldResponse = ApiSuccess<null>;
export type ReorderFieldResponse = ApiSuccess<{ field: FormField }>;