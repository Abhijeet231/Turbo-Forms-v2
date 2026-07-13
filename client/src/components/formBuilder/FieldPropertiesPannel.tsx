// Right side bar: edit every property of the currently selected field.
// The Zustand store is the source of truth — inputs read from it, changes are
// written back optimistically, and the server PATCH is debounced (~600ms).

import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Settings2 } from "lucide-react";

import { useBuilderStore } from "@/stores/useBuilderStore";
import { useUpdateField } from "@/hooks/form-field/useUpdateField";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { FIELD_TYPES } from "@/config/fieldTypes";
import type {
  FieldType,
  FormField,
  UpdateFieldInput,
  FieldValidationInput,
} from "@/schemas/form-field.schema";

// which field types own which controls
const OPTION_TYPES = new Set<FieldType>(["single_select", "multi_select", "dropdown"]);
const TEXT_TYPES = new Set<FieldType>(["short_text", "long_text", "email"]);
const PLACEHOLDER_TYPES = new Set<FieldType>([
  "short_text",
  "long_text",
  "email",
  "number",
  "date",
]);

// Build the server patch from the current field, keeping only the validation
// keys that are valid for the field's type (updateFieldSchema is .strict()).
const buildValidations = (field: FormField): FieldValidationInput => {
  const v = field.validations ?? {};
  const out: FieldValidationInput = {};

  if (TEXT_TYPES.has(field.type)) {
    if (v.minLength != null) out.minLength = v.minLength;
    if (v.maxLength != null) out.maxLength = v.maxLength;
    if (v.pattern) out.pattern = v.pattern;
  } else if (field.type === "number") {
    if (v.min != null) out.min = v.min;
    if (v.max != null) out.max = v.max;
  } else if (field.type === "rating") {
    if (v.minRating != null) out.minRating = v.minRating;
    if (v.maxRating != null) out.maxRating = v.maxRating;
  } else if (field.type === "multi_select") {
    if (v.minSelections != null) out.minSelections = v.minSelections;
    if (v.maxSelections != null) out.maxSelections = v.maxSelections;
  }

  return out;
};

const buildPatch = (field: FormField): UpdateFieldInput => {
  const patch: UpdateFieldInput = {
    label: field.label,
    placeholder: field.placeholder ? field.placeholder : null,
    help_text: field.help_text ? field.help_text : null,
    is_required: field.is_required,
    validations: buildValidations(field),
  };
  if (OPTION_TYPES.has(field.type)) {
    patch.options = field.options;
  }
  return patch;
};

const FieldPropertiesPannel = () => {
  const { id: formId } = useParams<{ id: string }>();
  const { mutate: updateFieldMutate, isLoading: isSaving } = useUpdateField(formId!);

  const field = useBuilderStore(
    (s) => s.fields.find((f) => f.id === s.selectedFieldId) ?? null
  );
  const updateField = useBuilderStore((s) => s.updateField);

  // Persist the *latest* store version of the field (read at flush time so we
  // never send a stale snapshot). Debounced so rapid typing = one request.
  const debouncedSave = useDebouncedCallback((fieldId: string) => {
    const current = useBuilderStore.getState().fields.find((f) => f.id === fieldId);
    if (!current) return;
    if (!current.label.trim()) return; // label is required — hold the save

    updateFieldMutate(fieldId, buildPatch(current)).catch(() => {
      toast.error("Failed to save changes");
    });
  }, 600);

  if (!field) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white/40">
        <Settings2 size={20} className="text-white/20" />
        <p className="text-sm">Select a field to edit its properties</p>
      </div>
    );
  }

  const meta = FIELD_TYPES.find((ft) => ft.type === field.type);
  const showOptions = OPTION_TYPES.has(field.type);
  const showPlaceholder = PLACEHOLDER_TYPES.has(field.type);
  const showValidations =
    TEXT_TYPES.has(field.type) ||
    field.type === "number" ||
    field.type === "rating" ||
    field.type === "multi_select";

  // helper: patch the store then schedule a save for this field
  const patch = (data: UpdateFieldInput) => {
    updateField(field.id, data);
    debouncedSave(field.id);
  };

  const setValidation = <K extends keyof FieldValidationInput>(
    key: K,
    value: FieldValidationInput[K]
  ) => {
    const nextValidations: FieldValidationInput = { ...field.validations, [key]: value };
    patch({ validations: nextValidations });
  };

  // ---- options handlers ----
  const updateOption = (index: number, key: "label" | "value", value: string) => {
    const options = field.options.map((o, i) => (i === index ? { ...o, [key]: value } : o));
    patch({ options });
  };

  const addOption = () => {
    const n = field.options.length + 1;
    patch({ options: [...field.options, { label: `Option ${n}`, value: `option_${n}` }] });
  };

  const removeOption = (index: number) => {
    if (field.options.length <= 1) {
      toast.error("At least one option is required");
      return;
    }
    patch({ options: field.options.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-white/40">FIELD PROPERTIES</p>
        <p className="mt-1 text-sm font-medium text-white/90">{meta?.label ?? field.type}</p>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Label */}
        <Field label="Label" required>
          <input
            type="text"
            value={field.label}
            onChange={(e) => patch({ label: e.target.value })}
            className={inputClass}
            placeholder="Question label"
          />
          {!field.label.trim() && (
            <p className="mt-1 text-xs text-red-400">Label is required</p>
          )}
        </Field>

        {/* Placeholder */}
        {showPlaceholder && (
          <Field label="Placeholder">
            <input
              type="text"
              value={field.placeholder ?? ""}
              onChange={(e) => patch({ placeholder: e.target.value })}
              className={inputClass}
              placeholder="Placeholder text"
            />
          </Field>
        )}

        {/* Help text */}
        <Field label="Help text">
          <textarea
            value={field.help_text ?? ""}
            onChange={(e) => patch({ help_text: e.target.value })}
            rows={2}
            className={inputClass}
            placeholder="Shown below the field"
          />
        </Field>

        {/* Required toggle */}
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm text-white/80">Required</span>
          <button
            type="button"
            role="switch"
            aria-checked={field.is_required}
            onClick={() => patch({ is_required: !field.is_required })}
            className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              field.is_required ? "bg-pink-500" : "bg-white/15"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                field.is_required ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>

        {/* Options */}
        {showOptions && (
          <div className="border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-white/40">OPTIONS</p>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300"
              >
                <Plus size={13} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {field.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => updateOption(i, "label", e.target.value)}
                    className={inputClass}
                    placeholder="Label"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="shrink-0 rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-red-400"
                    aria-label="Remove option"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validations */}
        {showValidations && (
          <div className="border-t border-white/10 pt-5">
            <p className="mb-3 text-xs font-medium tracking-wide text-white/40">VALIDATION</p>
            <div className="flex flex-col gap-4">
              {TEXT_TYPES.has(field.type) && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField
                      label="Min length"
                      value={field.validations?.minLength}
                      onChange={(v) => setValidation("minLength", v)}
                    />
                    <NumberField
                      label="Max length"
                      value={field.validations?.maxLength}
                      onChange={(v) => setValidation("maxLength", v)}
                    />
                  </div>
                  <Field label="Pattern (regex)">
                    <input
                      type="text"
                      value={field.validations?.pattern ?? ""}
                      onChange={(e) => setValidation("pattern", e.target.value || undefined)}
                      className={inputClass}
                      placeholder="^[a-z]+$"
                    />
                  </Field>
                </>
              )}

              {field.type === "number" && (
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Min"
                    value={field.validations?.min}
                    onChange={(v) => setValidation("min", v)}
                  />
                  <NumberField
                    label="Max"
                    value={field.validations?.max}
                    onChange={(v) => setValidation("max", v)}
                  />
                </div>
              )}

              {field.type === "rating" && (
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Min rating"
                    value={field.validations?.minRating}
                    onChange={(v) => setValidation("minRating", v)}
                  />
                  <NumberField
                    label="Max rating"
                    value={field.validations?.maxRating}
                    onChange={(v) => setValidation("maxRating", v)}
                  />
                </div>
              )}

              {field.type === "multi_select" && (
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Min selections"
                    value={field.validations?.minSelections}
                    onChange={(v) => setValidation("minSelections", v)}
                  />
                  <NumberField
                    label="Max selections"
                    value={field.validations?.maxSelections}
                    onChange={(v) => setValidation("maxSelections", v)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-white/10 px-5 py-3">
        <p className="text-xs text-white/30">{isSaving ? "Saving…" : "All changes saved"}</p>
      </div>
    </div>
  );
};

// ---- small presentational helpers ----

const inputClass =
  "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30";

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-white/60">
      {label}
      {required && <span className="ml-0.5 text-pink-400">*</span>}
    </label>
    {children}
  </div>
);

const NumberField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) => (
  <Field label={label}>
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      className={inputClass}
    />
  </Field>
);

export default FieldPropertiesPannel;
