import { useState } from "react"
import { useParams } from "react-router-dom"
import { useCreateField } from "@/hooks/form-field/useCreateField"
import { useBuilderStore } from "@/stores/useBuilderStore"
import { FIELD_TYPES, defaultLabelFor } from "@/config/fieldTypes"
import type { FieldType } from "@/schemas/form-field.schema"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const OPTION_TYPES = new Set(["single_select", "multi_select", "dropdown"])
const DEFAULT_OPTIONS = [
  { label: "Option 1", value: "option_1" },
  { label: "Option 2", value: "option_2" },
]

const FieldPalette = () => {
  const { id: formId } = useParams<{ id: string }>()
  const { mutate: createField } = useCreateField(formId!)
  const addField = useBuilderStore((s) => s.addField)

  // NEW: track which specific type is being created
  const [creatingType, setCreatingType] = useState<FieldType | null>(null)

  const handleAddField = async (type: FieldType) => {
    setCreatingType(type)
    try {
      const newField = await createField({
        type,
        label: defaultLabelFor(type),
        is_required: false,
        ...(OPTION_TYPES.has(type) && { options: DEFAULT_OPTIONS }),
      })
      addField(newField)
    } catch {
      toast.error("Error in creating field")
    } finally {
      setCreatingType(null)
    }
  }

  return (
    <aside className="w-72 shrink-0 border-white/10 p-6 overflow-y-auto">
      <p className="mb-3 text-xs font-medium tracking-wide text-white/50">ADD FIELD</p>
      <div className="flex flex-col gap-2">
        {FIELD_TYPES.map((ft) => {
          const Icon = ft.icon
          const isThisLoading = creatingType === ft.type
          const isAnyLoading = creatingType !== null

          return (
            <button
              key={ft.type}
              onClick={() => handleAddField(ft.type)}
              disabled={isAnyLoading}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                isThisLoading
                  ? "border-pink-500/40 bg-pink-500/5 text-white/60"
                  : "border-white/10 text-white/90 hover:border-pink-500/50 hover:bg-white/5"
              } ${isAnyLoading && !isThisLoading ? "opacity-40" : ""}`}
            >
              {isThisLoading ? (
                <Loader2 size={16} className="animate-spin text-pink-400" />
              ) : (
                <Icon size={16} className="text-white/60" />
              )}
              {ft.label}
              {isThisLoading && (
                <span className="ml-auto text-xs text-white/40">Adding…</span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default FieldPalette
