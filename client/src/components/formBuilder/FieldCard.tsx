import { FIELD_TYPES } from "@/config/fieldTypes"
import type { FormField } from "@/schemas/form-field.schema"
import { Trash2, GripVertical } from "lucide-react"

type FieldCardProps = {
  field: FormField
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
}

const FieldCard = ({ field, isSelected, onClick, onDelete }: FieldCardProps) => {
  const meta = FIELD_TYPES.find((ft) => ft.type === field.type)
  const Icon = meta?.icon

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // don't trigger onClick/select when deleting
    onDelete()
  }

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
        isSelected
          ? "border-pink-500/60 bg-pink-500/5"
          : "border-white/10 hover:border-white/20 hover:bg-white/5"
      }`}
    >
      <GripVertical size={16} className="shrink-0 text-white/20 cursor-grab" />

      {Icon && <Icon size={16} className="shrink-0 text-white/50" />}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">
          {field.label}
          {field.is_required && <span className="ml-1 text-pink-400">*</span>}
        </p>
        <p className="text-xs text-white/40">{meta?.label ?? field.type}</p>
      </div>

      <button
        onClick={handleDelete}
        className="shrink-0 rounded p-1.5 text-white/30 opacity-0 transition-opacity hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
        aria-label="Delete field"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default FieldCard