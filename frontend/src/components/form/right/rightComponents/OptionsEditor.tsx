import type { FieldOption } from "../../../../types/form-fields.types";

interface OptionsEditorProps {
  options: FieldOption[];
  onChange: (opts: FieldOption[]) => void;
}

const OptionsEditor = ({ options, onChange }: OptionsEditorProps) => {
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
              style={{ flex: 1, backgroundColor: "#0f0f0f", border: "0.5px solid #292524", borderRadius: 6, padding: "6px 8px", fontSize: 13, color: "#f5f5f4", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#44403c")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
            />
            <button
              onClick={() => removeOption(i)}
              disabled={options.length <= 1}
              style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", backgroundColor: "transparent", cursor: options.length <= 1 ? "not-allowed" : "pointer", color: options.length <= 1 ? "#292524" : "#57534e", flexShrink: 0, fontSize: 16, lineHeight: 1 }}
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
        style={{ marginTop: 8, width: "100%", padding: "6px 0", backgroundColor: "transparent", border: "0.5px dashed #292524", borderRadius: 6, color: "#78716c", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#44403c"; e.currentTarget.style.color = "#a8a29e"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#292524"; e.currentTarget.style.color = "#78716c"; }}
      >
        + Add option
      </button>
    </div>
  );
};

export default OptionsEditor;