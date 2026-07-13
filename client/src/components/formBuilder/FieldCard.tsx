import { FIELD_TYPES } from "@/config/fieldTypes"
import type { FormField } from "@/schemas/form-field.schema"
import { Trash2, GripVertical, Loader2 } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type FieldCardProps = {
  field: FormField
  isSelected: boolean
  isDeleting?: boolean
  onClick: () => void
  onDelete: () => void
}

const FieldCard = ({ field, isSelected, isDeleting = false, onClick, onDelete }: FieldCardProps) => {
  const meta = FIELD_TYPES.find((ft) => ft.type === field.type)
  const Icon = meta?.icon

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    disabled: isDeleting,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={isDeleting ? undefined : onClick}
      className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
        isDragging ? "z-10 opacity-80 shadow-lg shadow-black/40" : ""
      } ${
        isDeleting
          ? "cursor-not-allowed border-white/10 opacity-40"
          : "cursor-pointer " +
            (isSelected
              ? "border-pink-500/60 bg-pink-500/5"
              : "border-white/10 hover:border-white/20 hover:bg-white/5")
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 cursor-grab touch-none text-white/20 hover:text-white/40 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      {Icon && <Icon size={16} className="shrink-0 text-white/50" />}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">
          {field.label}
          {field.is_required && <span className="ml-1 text-pink-400">*</span>}
        </p>
        <p className="text-xs text-white/40">{meta?.label ?? field.type}</p>
      </div>

      {isDeleting ? (
        <Loader2 size={14} className="shrink-0 animate-spin text-white/40" />
      ) : (
        <button
          onClick={handleDelete}
          className="shrink-0 rounded p-1.5 text-white/30 opacity-0 transition-opacity hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
          aria-label="Delete field"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

export default FieldCard
