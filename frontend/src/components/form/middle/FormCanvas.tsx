import type { Dispatch, SetStateAction } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

import FieldCard from "./FieldCard";
import { reorderField } from "../../../services/form-fields.services";
import type { FormField } from "../../../types/form-fields.types";

interface FormCanvasProps {
  fields: FormField[];
  loading: boolean;
  selectedFieldId: string | null;
  onSelectField: Dispatch<SetStateAction<string | null>>;
  onDeleteField: (fieldId: string) => Promise<void>;
  formId: string; // needed for reorder API call
  onReorderFields: (fields: FormField[]) => void; // optimistic update back to parent
}

const FormCanvas = ({
  fields,
  loading,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  formId,
  onReorderFields,
}: FormCanvasProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // prevents accidental drags on click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistic update
    const reordered = arrayMove(fields, oldIndex, newIndex);
    onReorderFields(reordered);

    // Compute prevOrder / nextOrder from the NEW position
    const prevOrder = reordered[newIndex - 1]?.displayOrder ?? null;
    const nextOrder = reordered[newIndex + 1]?.displayOrder ?? null;

    try {
      const res = await reorderField(formId, String(active.id), { prevOrder, nextOrder });
      // Patch the moved field's displayOrder with the server's response
      const updated = res.data.data.field;
      onReorderFields(
        reordered.map((f) => (f.id === updated.id ? updated : f)),
      );
    } catch {
      // Rollback on failure
      onReorderFields(fields);
    }
  };

  // ── Empty state ──────────────────────────────────────────────
  if (!loading && fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full
        text-center px-8 select-none">
        <div className="w-12 h-12 rounded-xl bg-surface border border-border
          flex items-center justify-center mb-4">
          <i className="ti ti-layout-list text-xl text-text-tertiary" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-text-primary mb-1">No fields yet</p>
        <p className="text-xs text-text-tertiary leading-relaxed">
          Pick a field type from the left panel to get started.
        </p>
      </div>
    );
  }

  // ── Skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-surface border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 p-6 h-full overflow-y-auto">
          {fields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={onSelectField}
              onDelete={onDeleteField}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default FormCanvas;