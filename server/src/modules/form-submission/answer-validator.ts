import type { SelectFormField } from "../../db/models/form-fields.model.js";

// **** Value Validator ****

// Each function receives the raw strign value and the fields validation rules.
// Retns an error message string if invalid , null if valid.


// ** Validate text value **
export function validateTextValue(
    value: string,
    field: SelectFormField
): string | null {
    const v = field.validations as Record<string, unknown>;

    if (v.minLength !== undefined && value.length < (v.minLength as number)) {
        return `"${field.label}" must be at least ${v.minLength} characters`;
    }
    if (v.maxLength !== undefined && value.length > (v.maxLength as number)) {
        return `"${field.label}" must be at most ${v.maxLength} characters`;
    }
    if (v.pattern !== undefined) {
        const regex = new RegExp(v.pattern as string);
        if (!regex.test(value)) {
            return `"${field.label}" does not match the required pattern`;
        }
    }
    return null;
}

// ** Validate Email value **
export function validateEmailValue(value: string, field: SelectFormField): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return `"${field.label}" must be a valid email address`;
    }
    return null;
}

// ** Validate Number value **
export function validateNumberValue(
    value: string,
    field: SelectFormField
): string | null {
    const num = Number(value);
    if (isNaN(num)) {
        return `"${field.label}" must be a valid number`;
    }

    const v = field.validations as Record<string, unknown>;
    if (v.min !== undefined && num < (v.min as number)) {
        return `"${field.label}" must be at least ${v.min}`;
    }
    if (v.max !== undefined && num > (v.max as number)) {
        return `"${field.label}" must be at most ${v.max}`;
    }
    return null;
}

// ** Validate Date value **
export function validateDateValue(value: string, field: SelectFormField): string | null {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return `"${field.label}" must be a valid date`;
    }
    return null;
}

// ** validate boolean value ** 
export function validateBooleanValue(value: string, field: SelectFormField): string | null {
    if (value !== "true" && value !== "false") {
        return `"${field.label}" must be "true" or "false"`;
    }
    return null;
}

// ** validate Select value ** 
export function validateSelectValue(
    value: string,
    field: SelectFormField
): string | null {
    const options = (field.options as { label: string; value: string }[]) ?? [];
    const validValues = new Set(options.map((o) => o.value));

    if (!validValues.has(value)) {
        return `"${field.label}" contains an invalid option`;
    }
    return null;
}

// ** validate Multi-select value ** 
export function validateMultiSelectValue(
    value: string,
    field: SelectFormField
): string | null {
    // value is a JSON string: '["val1", "val2"]'
    let selected: unknown;
    try {
        selected = JSON.parse(value);
    } catch {
        return `"${field.label}" must be a valid JSON array string`;
    }

    if (!Array.isArray(selected)) {
        return `"${field.label}" must be a JSON array string`;
    }

    if (!selected.every((v) => typeof v === "string")) {
        return `"${field.label}" array must contain only strings`;
    }

    const options = (field.options as { label: string; value: string }[]) ?? [];
    const validValues = new Set(options.map((o) => o.value));

    for (const val of selected) {
        if (!validValues.has(val)) {
            return `"${field.label}" contains an invalid option: "${val}"`;
        }
    }

    const v = field.validations as Record<string, unknown>;
    if (
        v.minSelections !== undefined &&
        selected.length < (v.minSelections as number)
    ) {
        return `"${field.label}" requires at least ${v.minSelections} selections`;
    }
    if (
        v.maxSelections !== undefined &&
        selected.length > (v.maxSelections as number)
    ) {
        return `"${field.label}" allows at most ${v.maxSelections} selections`;
    }

    return null;
}

// ** Validate Rating value **
export function validateRatingValue(
    value: string,
    field: SelectFormField
): string | null {
    const num = Number(value);
    if (!Number.isInteger(num)) {
        return `"${field.label}" must be a whole number`;
    }

    const v = field.validations as Record<string, unknown>;
    const min = (v.minRating as number) ?? 1;
    const max = (v.maxRating as number) ?? 5;

    if (num < min || num > max) {
        return `"${field.label}" must be between ${min} and ${max}`;
    }
    return null;
}

// ** send each answer to the correct validator based on filed type ** 
export function validateAnswerValue(
    value: string,
    field: SelectFormField
): string | null {
    switch (field.type) {
        case "short_text":
        case "long_text":
            return validateTextValue(value, field);
        case "email":
            return validateEmailValue(value, field);
        case "number":
            return validateNumberValue(value, field);
        case "date":
            return validateDateValue(value, field);
        case "boolean":
            return validateBooleanValue(value, field);
        case "single_select":
        case "dropdown":
            return validateSelectValue(value, field);
        case "multi_select":
            return validateMultiSelectValue(value, field);
        case "rating":
            return validateRatingValue(value, field);
        default:
            return null;
    }
}
