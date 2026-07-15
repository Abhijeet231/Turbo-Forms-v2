// Shared formatting for stored submission answers. An answer is persisted as a
// (field_id, raw string value) pair; these turn it into something human-readable
// using the field definition. Used by the dashboard Submissions panel and the
// per-form FormResponse page.

import type { FormField } from "@/schemas/form-field.schema";

export const formatAnswer = (field: FormField | undefined, value: string): string => {
    if (!field) return value;

    switch (field.type) {
        case "boolean":
            return value === "true" ? "Yes" : "No";

        case "single_select":
        case "dropdown":
            return field.options.find((o) => o.value === value)?.label ?? value;

        case "multi_select":
            try {
                const arr = JSON.parse(value) as string[];
                return arr
                    .map((v) => field.options.find((o) => o.value === v)?.label ?? v)
                    .join(", ");
            } catch {
                return value;
            }

        case "rating": {
            const max = field.validations?.maxRating ?? 5;
            return `${value} / ${max}`;
        }

        default:
            return value;
    }
};

export const formatDate = (iso: string): string =>
    new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
