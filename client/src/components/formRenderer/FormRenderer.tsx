// Respondent-facing form card. Reused by the owner preview (previewMode) and
// the public /f/:slug page (pass onSubmit + submitting).

import { useState } from "react";
import type { Form } from "@/schemas/form.schema";
import type { FormField } from "@/schemas/form-field.schema";
import type { SubmitAnswerInput } from "@/schemas/form-submission";
import FieldRenderer, { type FieldValue } from "./FieldRenderer";

export type FormValues = Record<string, FieldValue>;

type FormRendererProps = {
  form: Pick<Form, "title" | "description">;
  fields: FormField[];
  previewMode?: boolean;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit?: (answers: SubmitAnswerInput[]) => void | Promise<void>;
};

const isEmpty = (v: FieldValue | undefined): boolean =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

// Validate one field's value. Mirrors the server rules so respondents get
// feedback before the request. Returns an error message or null.
const validateField = (field: FormField, value: FieldValue | undefined): string | null => {
  if (isEmpty(value)) {
    return field.is_required ? `${field.label} is required` : null;
  }

  const v = field.validations ?? {};

  switch (field.type) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
        return "Enter a valid email address";
      }
      break;
    case "short_text":
    case "long_text": {
      const s = value as string;
      if (v.minLength != null && s.length < v.minLength)
        return `Must be at least ${v.minLength} characters`;
      if (v.maxLength != null && s.length > v.maxLength)
        return `Must be at most ${v.maxLength} characters`;
      if (v.pattern) {
        try {
          if (!new RegExp(v.pattern).test(s)) return "Invalid format";
        } catch {
          /* ignore malformed pattern */
        }
      }
      break;
    }
    case "number": {
      const n = Number(value);
      if (Number.isNaN(n)) return "Must be a valid number";
      if (v.min != null && n < v.min) return `Must be at least ${v.min}`;
      if (v.max != null && n > v.max) return `Must be at most ${v.max}`;
      break;
    }
    case "multi_select": {
      const arr = value as string[];
      if (v.minSelections != null && arr.length < v.minSelections)
        return `Select at least ${v.minSelections}`;
      if (v.maxSelections != null && arr.length > v.maxSelections)
        return `Select at most ${v.maxSelections}`;
      break;
    }
  }

  return null;
};

// Serialize a field value to the string the API expects, or null to skip it.
const serialize = (field: FormField, value: FieldValue | undefined): string | null => {
  if (isEmpty(value)) return null;
  if (field.type === "multi_select") return JSON.stringify(value); // '["a","b"]'
  return String(value);
};

const FormRenderer = ({
  form,
  fields,
  previewMode = false,
  submitting = false,
  submitLabel = "Submit",
  onSubmit,
}: FormRendererProps) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (fieldId: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    // clear the error for this field as soon as the user edits it
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (previewMode) return; // preview never submits

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const err = validateField(field, values[field.id]);
      if (err) nextErrors[field.id] = err;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const answers: SubmitAnswerInput[] = [];
    for (const field of fields) {
      const value = serialize(field, values[field.id]);
      if (value !== null) answers.push({ field_id: field.id, value });
    }

    onSubmit?.(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold text-white">
          {form.title || "Untitled form"}
        </h1>
        {form.description && (
          <p className="text-sm text-white/50">{form.description}</p>
        )}
      </header>

      {fields.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">
          This form has no fields yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={values[field.id]}
              onChange={(v) => setValue(field.id, v)}
              error={errors[field.id]}
            />
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={previewMode || submitting}
            className="rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting…" : submitLabel}
          </button>
          {previewMode && (
            <p className="text-center text-xs text-white/30">
              Submitting is disabled in preview
            </p>
          )}
        </div>
      )}
    </form>
  );
};

export default FormRenderer;
