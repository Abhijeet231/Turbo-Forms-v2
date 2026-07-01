// config/fieldTypes.ts
import {
  TextIcon, AlignLeftIcon, MailIcon, HashIcon, CalendarIcon,
  CircleCheckIcon, ListChecksIcon, ChevronDownIcon, StarIcon, ToggleLeftIcon,
} from "lucide-react"
import type { FieldType } from "@/schemas/form-field.schema"

export type FieldTypeDefinition = {
  type: FieldType
  label: string
  icon: typeof TextIcon
}

export const FIELD_TYPES: FieldTypeDefinition[] = [
  { type: "short_text", label: "Short Text", icon: TextIcon },
  { type: "long_text", label: "Long Text", icon: AlignLeftIcon },
  { type: "email", label: "Email", icon: MailIcon },
  { type: "number", label: "Number", icon: HashIcon },
  { type: "date", label: "Date", icon: CalendarIcon },
  { type: "single_select", label: "Single Select", icon: CircleCheckIcon },
  { type: "multi_select", label: "Multi Select", icon: ListChecksIcon },
  { type: "dropdown", label: "Dropdown", icon: ChevronDownIcon },
  { type: "rating", label: "Rating", icon: StarIcon },
  { type: "boolean", label: "Yes / No", icon: ToggleLeftIcon },
]

// human-friendly default label per type, e.g. "Short Text" -> "Untitled Short Text Question"
export const defaultLabelFor = (type: FieldType): string => {
  const def = FIELD_TYPES.find((f) => f.type === type)
  return `Untitled ${def?.label ?? "Field"} Question`
}
