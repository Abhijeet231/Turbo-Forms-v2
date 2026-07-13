// Respondent-facing form card. Reused by the owner preview (previewMode) and,
// later, the public /f/:slug page (pass onSubmit + submitting).

import { useState } from "react";
import type { Form } from "@/schemas/form.schema";
import type { FormField } from "@/schemas/form-field.schema";
import FieldRenderer, { type FieldValue } from "./FieldRenderer";

export type FormValues = Record<string, FieldValue>;

type FormRendererProps = {
  form: Pick<Form, "title" | "description">;
  fields: FormField[];
  previewMode?: boolean;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit?: (values: FormValues) => void | Promise<void>;
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

  const setValue = (fieldId: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (previewMode) return; // preview never submits
    onSubmit?.(values);
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
