import { useState, useEffect, useCallback } from "react";
import type { FormField, UpdateFieldPayload, FieldOption, FieldValidation } from "../../../types/form-fields.types";
import { Divider } from "./rightComponents/SettingsSection";
import { BasicsSection } from "./rightComponents/BasicsSection";
import { ValidationSection } from "./rightComponents/ValidationSection";
import OptionsEditor from "./rightComponents/OptionsEditor";
import { Section } from "./rightComponents/SettingsSection";

interface FieldSettingsProps {
  field: FormField | null;
  onUpdateField: (fieldId: string, payload: UpdateFieldPayload) => Promise<void>;
}

const TYPE_LABEL: Record<string, string> = {
  short_text: "Short Answer", long_text: "Long Answer", email: "Email Address",
  number: "Number", date: "Date", single_select: "Single Choice",
  multi_select: "Multiple Choice", dropdown: "Dropdown", rating: "Rating", boolean: "Yes / No",
};

const FieldSettings = ({ field, onUpdateField }: FieldSettingsProps) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [validations, setValidations] = useState<FieldValidation>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

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
    const fieldId = field.id;
    const hasOptions = ["single_select", "multi_select", "dropdown"].includes(field.type);
    setSaving(true);
    const payload: UpdateFieldPayload = {
      label: label.trim() || undefined,
      description: description.trim() || undefined,
      placeholder: placeholder.trim() || undefined,
      isRequired,
      ...(hasOptions && { options }),
      ...(Object.keys(validations).length > 0 && { validations }),
    };
    await onUpdateField(fieldId, payload); // ✅ captured id
    setSaving(false);
    setDirty(false);
  };

  if (!field) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#1c1917", border: "0.5px solid #292524", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 18 }}>
          ✦
        </div>
        <p style={{ color: "#a8a29e", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>No field selected</p>
        <p style={{ color: "#57534e", fontSize: 12, lineHeight: 1.5 }}>Click a field in the canvas to edit its settings.</p>
      </div>
    );
  }

  const hasOptions = ["single_select", "multi_select", "dropdown"].includes(field.type);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #1c1917", flexShrink: 0 }}>
        <p style={{ color: "#57534e", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Field Settings</p>
        <p style={{ color: "#a8a29e", fontSize: 13, fontWeight: 500 }}>{TYPE_LABEL[field.type] ?? field.type}</p>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <BasicsSection
          label={label} onLabelChange={setLabel}
          description={description} onDescriptionChange={setDescription}
          placeholder={placeholder} onPlaceholderChange={setPlaceholder}
          isRequired={isRequired} onRequiredChange={setIsRequired}
          showPlaceholder={!hasOptions && field.type !== "boolean" && field.type !== "date" && field.type !== "rating"}
          markDirty={markDirty}
        />
        <Divider />
        {hasOptions && (
          <>
            <Section title="Options">
              <OptionsEditor options={options} onChange={(o) => { setOptions(o); markDirty(); }} />
            </Section>
            <Divider />
          </>
        )}
        <ValidationSection
          fieldType={field.type} validations={validations}
          onChange={setValidations} markDirty={markDirty}
        />
      </div>

      {/* Save button */}
      <div style={{ padding: "12px 20px", borderTop: "0.5px solid #1c1917", flexShrink: 0 }}>
        <button
          onClick={handleSave} disabled={!dirty || saving}
          style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "none", backgroundColor: dirty && !saving ? "#c2410c" : "#1c1917", color: dirty && !saving ? "#fff" : "#57534e", fontSize: 13, fontWeight: 500, cursor: dirty && !saving ? "pointer" : "not-allowed", transition: "all 0.15s" }}
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