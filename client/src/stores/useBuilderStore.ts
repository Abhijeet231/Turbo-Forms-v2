import { create } from "zustand"
import type { FormField } from "@/schemas/form-field.schema"
import { type UpdateFieldInput } from "@/schemas/form-field.schema"

type BuilderState = {
  fields: FormField[]
  selectedFieldId: string | null

  setFields: (fields: FormField[]) => void
  addField: (field: FormField) => void
  updateField: (id: string, patch: UpdateFieldInput) => void
  removeField: (id: string) => void
  selectField: (id: string | null) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  fields: [],
  selectedFieldId: null,

  setFields: (fields) => set({ fields }),

  addField: (field) => set((state) => ({ fields: [...state.fields, field] })),

  updateField: (id, patch) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
      selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
    })),

  selectField: (id) => set({ selectedFieldId: id }),
}))