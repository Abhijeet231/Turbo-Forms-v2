import type { ReactNode } from "react";

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: 24 }}>
    <p style={{ color: "#57534e", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
      {title}
    </p>
    {children}
  </div>
);

export const Divider = () => (
  <div style={{ borderTop: "0.5px solid #1c1917", marginBottom: 24 }} />
);