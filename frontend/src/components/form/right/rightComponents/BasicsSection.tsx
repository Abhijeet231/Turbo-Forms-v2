import { Input } from "./SettingsInput";
import { Section } from "./SettingsSection";

interface BasicsSectionProps {
  label: string; onLabelChange: (v: string) => void;
  description: string; onDescriptionChange: (v: string) => void;
  placeholder: string; onPlaceholderChange: (v: string) => void;
  isRequired: boolean; onRequiredChange: (v: boolean) => void;
  showPlaceholder: boolean;
  markDirty: () => void;
}

export const BasicsSection = ({
  label, onLabelChange, description, onDescriptionChange,
  placeholder, onPlaceholderChange, isRequired, onRequiredChange,
  showPlaceholder, markDirty,
}: BasicsSectionProps) => (
  <Section title="Basics">
    <Input label="Label" value={label}
      onChange={(v) => { onLabelChange(v); markDirty(); }}
      placeholder="e.g. Your email address" />
    <Input label="Description" value={description}
      onChange={(v) => { onDescriptionChange(v); markDirty(); }}
      placeholder="Helper text shown below the field" />
    {showPlaceholder && (
      <Input label="Placeholder" value={placeholder}
        onChange={(v) => { onPlaceholderChange(v); markDirty(); }}
        placeholder="e.g. Enter your answer..." />
    )}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
      <div>
        <p style={{ color: "#a8a29e", fontSize: 13 }}>Required</p>
        <p style={{ color: "#57534e", fontSize: 11, marginTop: 2 }}>Respondents must answer this field</p>
      </div>
      <button
        onClick={() => { onRequiredChange(!isRequired); markDirty(); }}
        style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: isRequired ? "#c2410c" : "#292524", border: "none", cursor: "pointer", position: "relative", transition: "background-color 0.2s", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", top: 2, left: isRequired ? 18 : 2, width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.2s" }} />
      </button>
    </div>
  </Section>
);