export const Input = ({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) => (
  <div className="mb-4">
    <label style={{ color: "#a8a29e", fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
      {label}
    </label>
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", backgroundColor: "#0f0f0f", border: "0.5px solid #292524", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#f5f5f4", outline: "none", boxSizing: "border-box" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#44403c")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
    />
  </div>
);

export const NumberInput = ({
  label, value, onChange, placeholder,
}: {
  label: string; value: number | undefined;
  onChange: (v: number | undefined) => void; placeholder?: string;
}) => (
  <div style={{ flex: 1 }}>
    <label style={{ color: "#a8a29e", fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
      {label}
    </label>
    <input
      type="number" value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      placeholder={placeholder}
      style={{ width: "100%", backgroundColor: "#0f0f0f", border: "0.5px solid #292524", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#f5f5f4", outline: "none", boxSizing: "border-box" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#44403c")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
    />
  </div>
);