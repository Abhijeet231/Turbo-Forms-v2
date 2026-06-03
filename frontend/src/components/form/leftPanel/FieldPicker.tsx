import type { FieldType } from "../../../types/form-fields.types";
import FieldPickerItem from "./FieldPickerItem";

interface FieldPickerProps {
  onAddField: (type: FieldType) => Promise<void>;
}

type FieldGroup = {
  label: string;
  items: {
    type: FieldType;
    label: string;
    icon: string;
  }[];
};

const FIELD_GROUPS: FieldGroup[] = [
  {
    label: "Text",
    items: [
      { type: "short_text", label: "Short answer",   icon: "ti-text-size" },
      { type: "long_text",  label: "Long answer",    icon: "ti-align-left" },
      { type: "email",      label: "Email address",  icon: "ti-mail" },
      { type: "number",     label: "Number",         icon: "ti-numbers" },
    ],
  },
  {
    label: "Date & time",
    items: [
      { type: "date", label: "Date", icon: "ti-calendar" },
    ],
  },
  {
    label: "Choice",
    items: [
      { type: "single_select", label: "Single choice",   icon: "ti-circle-dot" },
      { type: "multi_select",  label: "Multiple choice", icon: "ti-checkbox" },
      { type: "dropdown",      label: "Dropdown",        icon: "ti-chevron-down" },
      { type: "boolean",       label: "Yes / No",        icon: "ti-toggle-left" },
    ],
  },
  {
    label: "Scale",
    items: [
      { type: "rating", label: "Rating", icon: "ti-star" },
    ],
  },
];

const FieldPicker = ({ onAddField }: FieldPickerProps) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
          Add field
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {FIELD_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-4 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-widest">
              {group.label}
            </p>
            <div className="px-2">
              {group.items.map((item) => (
                <FieldPickerItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  icon={item.icon}
                  onAdd={onAddField}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldPicker;