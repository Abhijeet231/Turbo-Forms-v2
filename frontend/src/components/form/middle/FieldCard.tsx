import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandle from "./DragHandle";
import type { FormField } from "../../../types/form-fields.types";

const FIELD_TYPE_META: Record<
  FormField["type"],
  { icon: string; label: string }
> = {
  short_text: { icon: "ti-text-size", label: "Short answer" },
  long_text: { icon: "ti-align-left", label: "Long answer" },
  email: { icon: "ti-mail", label: "Email address" },
  number: { icon: "ti-numbers", label: "Number" },
  date: { icon: "ti-calendar", label: "Date" },
  single_select: { icon: "ti-circle-dot", label: "Single choice" },
  multi_select: { icon: "ti-checkbox", label: "Multiple choice" },
  dropdown: { icon: "ti-chevron-down", label: "Dropdown" },
  boolean: { icon: "ti-toggle-left", label: "Yes / No" },
  rating: { icon: "ti-star", label: "Rating" },
};

interface FieldCardProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

const FieldCard = ({
  field,
  isSelected,
  onSelect,
  onDelete,
}: FieldCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = FIELD_TYPE_META[field.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(field.id)}
      className={`
        group relative flex items-start gap-3 px-4 py-3.5 rounded-lg border
        cursor-pointer transition-all duration-150 bg-background
        ${
          isDragging
            ? "opacity-50 shadow-lg scale-[1.02] border-border-strong z-50"
            : isSelected
              ? "border-primary ring-2 ring-primary/20 shadow-sm"
              : "border-border hover:border-border-strong hover:shadow-sm"
        }
      `}
    >
      {/* Drag handle */}
      <div
        className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <DragHandle listeners={listeners} attributes={attributes} />
      </div>

      {/* Type icon */}
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md
        bg-surface border border-border shrink-0 mt-0.5"
      >
        <i
          className={`ti ${meta.icon} text-sm text-text-secondary`}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {field.label}
        </p>
        <p className="text-xs text-text-tertiary mt-0.5">
          {meta.label}
          {field.isRequired && (
            <span className="ml-1.5 text-danger">required</span>
          )}
        </p>
      </div>

      {/* Delete button */}
      <button
  onClick={(e) => {
    e.stopPropagation();
    onDelete(field.id);
  }}
  className="shrink-0 flex items-center justify-center w-6 h-6 rounded hover:bg-red-500/10 transition-all duration-150 mt-0.5"
  aria-label={`Delete ${field.label}`}
>
  <i className="ti ti-trash text-base text-zinc-400 hover:text-red-500" aria-hidden="true" />
</button>
    </div>
  );
};

export default FieldCard;
