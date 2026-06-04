import { NumberInput } from "./SettingsInput";
import { Section } from "./SettingsSection";
import type { FieldValidation, FieldType } from "../../../../types/form-fields.types";

interface ValidationSectionProps {
  fieldType: FieldType;
  validations: FieldValidation;
  onChange: (v: FieldValidation) => void;
  markDirty: () => void;
}

export const ValidationSection = ({ fieldType, validations, onChange, markDirty }: ValidationSectionProps) => {
  const hasText = ["short_text", "long_text", "email"].includes(fieldType);
  const hasNumber = fieldType === "number";
  const hasRating = fieldType === "rating";
  const hasSelect = fieldType === "multi_select";

  if (!hasText && !hasNumber && !hasRating && !hasSelect) return null;

  const update = (patch: Partial<FieldValidation>) => {
    onChange({ ...validations, ...patch });
    markDirty();
  };

  return (
    <Section title="Validation">
      {hasText && (
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          <NumberInput label="Min length" value={validations.minLength} placeholder="0"
            onChange={(v) => update({ minLength: v })} />
          <NumberInput label="Max length" value={validations.maxLength} placeholder="∞"
            onChange={(v) => update({ maxLength: v })} />
        </div>
      )}
      {hasNumber && (
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          <NumberInput label="Min value" value={validations.min} placeholder="0"
            onChange={(v) => update({ min: v })} />
          <NumberInput label="Max value" value={validations.max} placeholder="∞"
            onChange={(v) => update({ max: v })} />
        </div>
      )}
      {hasRating && (
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          <NumberInput label="Min rating" value={validations.minRating} placeholder="1"
            onChange={(v) => update({ minRating: v })} />
          <NumberInput label="Max rating" value={validations.maxRating} placeholder="5"
            onChange={(v) => update({ maxRating: v })} />
        </div>
      )}
      {hasSelect && (
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          <NumberInput label="Min selections" value={validations.minSelections} placeholder="1"
            onChange={(v) => update({ minSelections: v })} />
          <NumberInput label="Max selections" value={validations.maxSelections} placeholder="∞"
            onChange={(v) => update({ maxSelections: v })} />
        </div>
      )}
    </Section>
  );
};