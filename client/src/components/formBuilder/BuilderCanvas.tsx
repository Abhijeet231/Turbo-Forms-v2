import { useEffect, useState } from "react";
import { useBuilderStore } from "@/stores/useBuilderStore";
import FieldCard from "./FieldCard";
import { useDeleteField } from "@/hooks/form-field/useDeleteField";
import { useReorderField } from "@/hooks/form-field/useReorderField";
import { toast } from "sonner";
import { useGetAllFields } from "@/hooks/form-field/useGetAllFields";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const BuilderCanvas = () => {
  const { id } = useParams<{ id: string }>();

  const fields = useBuilderStore((s) => s.fields);
  const selectedFieldId = useBuilderStore((s) => s.selectedFieldId);
  const selectField = useBuilderStore((s) => s.selectField);
  const removeField = useBuilderStore((s) => s.removeField);
  const setFields = useBuilderStore((s) => s.setFields);

  const { data, isLoading, error, refetch } = useGetAllFields(id!);
  const { mutate: deleteField } = useDeleteField(id!);
  const { mutate: reorderField } = useReorderField(id!);

  // delete tracking stuff
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);

  // require a small drag distance so plain clicks still select the field
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (data) {
      setFields(data);
    }
  }, [data, setFields]);

  const handleDelete = async (fieldId: string) => {
    setDeletingFieldId(fieldId);
    try {
      await deleteField(fieldId);
      removeField(fieldId); // optimistic local update after confirmed delete
      toast.success("Field deleted");
    } catch {
      toast.error("Failed to delete field");
    } finally {
      setDeletingFieldId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(fields, oldIndex, newIndex);
    const snapshot = fields;
    setFields(reordered); // optimistic reorder

    // neighbours in the new arrangement drive the fractional index on the server
    const prevOrder = reordered[newIndex - 1]?.order ?? null;
    const nextOrder = reordered[newIndex + 1]?.order ?? null;

    try {
      const updated = await reorderField(active.id as string, { prevOrder, nextOrder });
      // sync the moved field's new order key so later reorders compute correctly
      setFields(
        reordered.map((f) => (f.id === updated.id ? { ...f, order: updated.order } : f))
      );
    } catch {
      setFields(snapshot); // rollback
      toast.error("Failed to reorder field");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/40">
        <p className="text-sm">Loading fields...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-white/40">
        <p className="text-sm">{error}</p>
        <button onClick={() => refetch()} className="text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/40">
        <p className="text-sm">
          No fields yet - add one from the palette to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={field.id === selectedFieldId}
                onClick={() => selectField(field.id)}
                onDelete={() => handleDelete(field.id)}
                isDeleting={field.id === deletingFieldId}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default BuilderCanvas;
