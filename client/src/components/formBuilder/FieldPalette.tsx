import { useParams } from "react-router-dom"
import { useCreateField } from "@/hooks/form-field/useCreateField"
import { useBuilderStore } from "@/stores/useBuilderStore"
import { FIELD_TYPES, defaultLabelFor } from "@/config/fieldTypes"
import type { FieldType } from "@/schemas/form-field.schema"
import { toast } from "sonner"

const FieldPalette = () => {
  const { id: formId } = useParams<{ id: string }>()
  const { mutate: createField, isLoading } = useCreateField(formId!)
  const addField = useBuilderStore((s) => s.addField)

  const handleAddField = async (type: FieldType) => {
    try {
      const newField = await createField({
        type,
        label: defaultLabelFor(type),
        is_required: false,
      })
      addField(newField)
    } catch {
      toast.error("Error in Creating filed")
    }
  }

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 p-6 overflow-y-auto">
      <p className="mb-3 text-xs font-medium tracking-wide text-white/50">ADD FIELD</p>
      <div className="flex flex-col gap-2">
        {FIELD_TYPES.map((ft) => {
          const Icon = ft.icon
          return (
            <button
              key={ft.type}
              onClick={() => handleAddField(ft.type)}
              disabled={isLoading}
              className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 text-left text-sm font-medium text-white/90 hover:border-pink-500/50 hover:bg-white/5 disabled:opacity-50"
            >
              <Icon size={16} className="text-white/60" />
              {ft.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default FieldPalette
