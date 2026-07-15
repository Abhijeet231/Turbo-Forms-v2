// Renders a single form field as a respondent-facing control.
// Reused by the preview page and (later) the public /f/:slug page.

import { Star } from "lucide-react";
import type { FormField } from "@/schemas/form-field.schema";

export type FieldValue = string | string[];

type FieldRendererProps = {
  field: FormField;
  value: FieldValue | undefined;
  onChange: (value: FieldValue) => void;
  disabled?: boolean;
  error?: string;
};

const controlClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30 disabled:opacity-60";

const FieldRenderer = ({ field, value, onChange, disabled, error }: FieldRendererProps) => {
  const strValue = typeof value === "string" ? value : "";
  const arrValue = Array.isArray(value) ? value : [];

  const renderControl = () => {
    switch (field.type) {
      case "short_text":
        return (
          <input
            type="text"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? ""}
            disabled={disabled}
            className={controlClass}
          />
        );

      case "email":
        return (
          <input
            type="email"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "you@example.com"}
            disabled={disabled}
            className={controlClass}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? ""}
            min={field.validations?.min}
            max={field.validations?.max}
            disabled={disabled}
            className={controlClass}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`${controlClass} scheme-dark`}
          />
        );

      case "long_text":
        return (
          <textarea
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? ""}
            rows={4}
            disabled={disabled}
            className={controlClass}
          />
        );

      case "dropdown":
        return (
          <select
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`${controlClass} ${strValue ? "" : "text-white/30"}`}
          >
            <option value="" disabled>
              {field.placeholder ?? "Select an option"}
            </option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-white">
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "single_select":
        return (
          <div className="flex flex-col gap-2">
            {field.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                  strValue === opt.value
                    ? "border-pink-500/60 bg-pink-500/5 text-white"
                    : "border-white/10 text-white/80 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={strValue === opt.value}
                  onChange={() => onChange(opt.value)}
                  disabled={disabled}
                  className="accent-pink-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "multi_select":
        return (
          <div className="flex flex-col gap-2">
            {field.options.map((opt) => {
              const checked = arrValue.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                    checked
                      ? "border-pink-500/60 bg-pink-500/5 text-white"
                      : "border-white/10 text-white/80 hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={checked}
                    onChange={() =>
                      onChange(
                        checked
                          ? arrValue.filter((v) => v !== opt.value)
                          : [...arrValue, opt.value]
                      )
                    }
                    disabled={disabled}
                    className="accent-pink-500"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        );

      case "rating": {
        const max = field.validations?.maxRating ?? 5;
        const selected = Number(strValue) || 0;
        return (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                disabled={disabled}
                onClick={() => onChange(String(n))}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="text-white/30 transition-colors hover:text-pink-400 disabled:cursor-not-allowed"
              >
                <Star
                  size={26}
                  className={n <= selected ? "fill-pink-500 text-pink-500" : ""}
                />
              </button>
            ))}
          </div>
        );
      }

      case "boolean":
        return (
          <div className="flex gap-2">
            {[
              { label: "Yes", val: "true" },
              { label: "No", val: "false" },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                disabled={disabled}
                onClick={() => onChange(opt.val)}
                className={`flex-1 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  strValue === opt.val
                    ? "border-pink-500/60 bg-pink-500/5 text-white"
                    : "border-white/10 text-white/80 hover:border-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/90">
        {field.label}
        {field.is_required && <span className="ml-1 text-pink-400">*</span>}
      </label>

      {field.help_text && <p className="text-xs text-white/40">{field.help_text}</p>}

      {renderControl()}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default FieldRenderer;
