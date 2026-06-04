import { useState, useEffect, useCallback } from "react";
import type { FormField, UpdateFieldPayload, FieldOption, FieldValidation } from "../../../types/form-fields.types";

interface FieldSettingsProps {
  field: FormField | null;
  onUpdateField: (fieldId: string, payload: UpdateFieldPayload) => Promise<void>;
}

// ── Tiny reusable input ────────────────────────────────────────
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="mb-4">
    <label
      style={{ color: "#a8a29e", fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        backgroundColor: "#0f0f0f",
        border: "0.5px solid #292524",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 13,
        color: "#f5f5f4",
        outline: "none",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#44403c")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
    />
  </div>
);

const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) => (
  <div style={{ flex: 1 }}>
    <label
      style={{ color: "#a8a29e", fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}
    >
      {label}
    </label>
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      placeholder={placeholder}
      style={{
        width: "100%",
        backgroundColor: "#0f0f0f",
        border: "0.5px solid #292524",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 13,
        color: "#f5f5f4",
        outline: "none",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#44403c")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
    />
  </div>
);

// ── Section wrapper ────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 24 }}>
    <p style={{ color: "#57534e", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
      {title}
    </p>
    {children}
  </div>
);

// ── Divider ────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ borderTop: "0.5px solid #1c1917", marginBottom: 24 }} />
);

// ── Options editor (for select/dropdown fields) ────────────────
const OptionsEditor = ({
  options,
  onChange,
}: {
  options: FieldOption[];
  onChange: (opts: FieldOption[]) => void;
}) => {
  const addOption = () => {
    const idx = options.length + 1;
    onChange([...options, { label: `Option ${idx}`, value: `option_${idx}` }]);
  };

  const updateOption = (i: number, label: string) => {
    const updated = options.map((o, idx) =>
      idx === i ? { label, value: label.toLowerCase().replace(/\s+/g, "_") } : o
    );
    onChange(updated);
  };

  const removeOption = (i: number) => {
    onChange(options.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ color: "#a8a29e", fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
        Options
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ color: "#57534e", fontSize: 11, width: 16, textAlign: "right", flexShrink: 0 }}>
              {i + 1}.
            </div>
            <input
              value={opt.label}
              onChange={(e) => updateOption(i, e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "#0f0f0f",
                border: "0.5px solid #292524",
                borderRadius: 6,
                padding: "6px 8px",
                fontSize: 13,
                color: "#f5f5f4",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#44403c")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
            />
            <button
              onClick={() => removeOption(i)}
              disabled={options.length <= 1}
              style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                border: "none",
                backgroundColor: "transparent",
                cursor: options.length <= 1 ? "not-allowed" : "pointer",
                color: options.length <= 1 ? "#292524" : "#57534e",
                flexShrink: 0,
                fontSize: 16,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => options.length > 1 && (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = options.length <= 1 ? "#292524" : "#57534e")}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addOption}
        style={{
          marginTop: 8,
          width: "100%",
          padding: "6px 0",
          backgroundColor: "transparent",
          border: "0.5px dashed #292524",
          borderRadius: 6,
          color: "#78716c",
          fontSize: 12,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#44403c";
          e.currentTarget.style.color = "#a8a29e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#292524";
          e.currentTarget.style.color = "#78716c";
        }}
      >
        + Add option
      </button>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────
const FieldSettings = ({ field, onUpdateField }: FieldSettingsProps) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [validations, setValidations] = useState<FieldValidation>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Sync state when field changes
  useEffect(() => {
    if (!field) return;
    setLabel(field.label ?? "");
    setDescription(field.description ?? "");
    setPlaceholder(field.placeholder ?? "");
    setIsRequired(field.isRequired ?? false);
    setOptions(field.options ?? [{ label: "Option 1", value: "option_1" }]);
    setValidations(field.validations ?? {});
    setDirty(false);
  }, [field?.id]);

  const markDirty = useCallback(() => setDirty(true), []);

  const handleSave = async () => {
    if (!field) return;
    setSaving(true);
    const payload: UpdateFieldPayload = {
      label: label.trim() || undefined,
      description: description.trim() || undefined,
      placeholder: placeholder.trim() || undefined,
      isRequired,
      ...(hasOptions && { options }),
      ...(Object.keys(validations).length > 0 && { validations }),
    };
    await onUpdateField(field.id, payload);
    setSaving(false);
    setDirty(false);
  };

  if (!field) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#1c1917",
            border: "0.5px solid #292524",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            fontSize: 18,
          }}
        >
          ✦
        </div>
        <p style={{ color: "#a8a29e", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
          No field selected
        </p>
        <p style={{ color: "#57534e", fontSize: 12, lineHeight: 1.5 }}>
          Click a field in the canvas to edit its settings.
        </p>
      </div>
    );
  }

  const hasOptions = ["single_select", "multi_select", "dropdown"].includes(field.type);
  const hasTextValidation = ["short_text", "long_text", "email"].includes(field.type);
  const hasNumberValidation = field.type === "number";
  const hasRatingValidation = field.type === "rating";
  const hasSelectValidation = ["multi_select"].includes(field.type);

  const TYPE_LABEL: Record<string, string> = {
    short_text: "Short Answer",
    long_text: "Long Answer",
    email: "Email Address",
    number: "Number",
    date: "Date",
    single_select: "Single Choice",
    multi_select: "Multiple Choice",
    dropdown: "Dropdown",
    rating: "Rating",
    boolean: "Yes / No",
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "0.5px solid #1c1917",
          flexShrink: 0,
        }}
      >
        <p style={{ color: "#57534e", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
          Field Settings
        </p>
        <p style={{ color: "#a8a29e", fontSize: 13, fontWeight: 500 }}>
          {TYPE_LABEL[field.type] ?? field.type}
        </p>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

        <Section title="Basics">
          <Input
            label="Label"
            value={label}
            onChange={(v) => { setLabel(v); markDirty(); }}
            placeholder="e.g. Your email address"
          />
          <Input
            label="Description"
            value={description}
            onChange={(v) => { setDescription(v); markDirty(); }}
            placeholder="Helper text shown below the field"
          />
          {!hasOptions && field.type !== "boolean" && field.type !== "date" && field.type !== "rating" && (
            <Input
              label="Placeholder"
              value={placeholder}
              onChange={(v) => { setPlaceholder(v); markDirty(); }}
              placeholder="e.g. Enter your answer..."
            />
          )}

          {/* Required toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
            <div>
              <p style={{ color: "#a8a29e", fontSize: 13 }}>Required</p>
              <p style={{ color: "#57534e", fontSize: 11, marginTop: 2 }}>Respondents must answer this field</p>
            </div>
            <button
              onClick={() => { setIsRequired((p) => !p); markDirty(); }}
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                backgroundColor: isRequired ? "#c2410c" : "#292524",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: isRequired ? 18 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>
        </Section>

        <Divider />

        {/* Options editor */}
        {hasOptions && (
          <>
            <Section title="Options">
              <OptionsEditor
                options={options}
                onChange={(o) => { setOptions(o); markDirty(); }}
              />
            </Section>
            <Divider />
          </>
        )}

        {/* Validations */}
        {(hasTextValidation || hasNumberValidation || hasRatingValidation || hasSelectValidation) && (
          <Section title="Validation">
            {hasTextValidation && (
              <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <NumberInput
                  label="Min length"
                  value={validations.minLength}
                  onChange={(v) => { setValidations((p) => ({ ...p, minLength: v })); markDirty(); }}
                  placeholder="0"
                />
                <NumberInput
                  label="Max length"
                  value={validations.maxLength}
                  onChange={(v) => { setValidations((p) => ({ ...p, maxLength: v })); markDirty(); }}
                  placeholder="∞"
                />
              </div>
            )}
            {hasNumberValidation && (
              <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <NumberInput
                  label="Min value"
                  value={validations.min}
                  onChange={(v) => { setValidations((p) => ({ ...p, min: v })); markDirty(); }}
                  placeholder="0"
                />
                <NumberInput
                  label="Max value"
                  value={validations.max}
                  onChange={(v) => { setValidations((p) => ({ ...p, max: v })); markDirty(); }}
                  placeholder="∞"
                />
              </div>
            )}
            {hasRatingValidation && (
              <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <NumberInput
                  label="Min rating"
                  value={validations.minRating}
                  onChange={(v) => { setValidations((p) => ({ ...p, minRating: v })); markDirty(); }}
                  placeholder="1"
                />
                <NumberInput
                  label="Max rating"
                  value={validations.maxRating}
                  onChange={(v) => { setValidations((p) => ({ ...p, maxRating: v })); markDirty(); }}
                  placeholder="5"
                />
              </div>
            )}
            {hasSelectValidation && (
              <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <NumberInput
                  label="Min selections"
                  value={validations.minSelections}
                  onChange={(v) => { setValidations((p) => ({ ...p, minSelections: v })); markDirty(); }}
                  placeholder="1"
                />
                <NumberInput
                  label="Max selections"
                  value={validations.maxSelections}
                  onChange={(v) => { setValidations((p) => ({ ...p, maxSelections: v })); markDirty(); }}
                  placeholder="∞"
                />
              </div>
            )}
          </Section>
        )}
      </div>

      {/* Save button */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "0.5px solid #1c1917",
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: 8,
            border: "none",
            backgroundColor: dirty && !saving ? "#c2410c" : "#1c1917",
            color: dirty && !saving ? "#fff" : "#57534e",
            fontSize: 13,
            fontWeight: 500,
            cursor: dirty && !saving ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => dirty && !saving && (e.currentTarget.style.backgroundColor = "#9a3412")}
          onMouseLeave={(e) => dirty && !saving && (e.currentTarget.style.backgroundColor = "#c2410c")}
        >
          {saving ? "Saving..." : dirty ? "Save changes" : "No changes"}
        </button>
      </div>
    </div>
  );
};

export default FieldSettings;