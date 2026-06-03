import type { FieldType } from "../../../types/form-fields.types";

interface FieldPickerItemProps {
  type: FieldType;
  label: string;
  icon: string; // Tabler icon name e.g. "ti-text-size"
  onAdd: (type: FieldType) => Promise<void>;
}

const FieldPickerItem = ({ type, label, icon, onAdd }: FieldPickerItemProps) => {
  return (
    <button
      onClick={() => onAdd(type)}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left
        text-sm text-text-secondary hover:text-text-primary
        hover:bg-surface-hover transition-colors duration-150 group cursor-pointer"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-md
        bg-surface border border-border text-text-secondary
        group-hover:border-border-strong group-hover:text-text-primary
        transition-colors duration-150 shrink-0">
        <i className={`ti ${icon} text-base`} aria-hidden="true" />
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
};

export default FieldPickerItem;