import { useEffect } from "react";
import { useBuilderStore } from "@/stores/useBuilderStore";
import FieldCard from "./FieldCard";
import { useDeleteField } from "@/hooks/form-field/useDeleteField";
import { toast } from "sonner";
import { useGetAllFields } from "@/hooks/form-field/useGetAllFields";
import { useParams } from "react-router-dom";

const BuilderCanvas = () => {
  const { id } = useParams<{ id: string }>();

  const fields = useBuilderStore((s) => s.fields);
  const selectedFieldId = useBuilderStore((s) => s.selectedFieldId);
  const selectField = useBuilderStore((s) => s.selectField);
  const removeField = useBuilderStore((s) => s.removeField);
  const setFields = useBuilderStore((s) => s.setFields);

  const { data, isLoading, error, refetch } = useGetAllFields(id!);
  const { mutate: deleteField } = useDeleteField(id!);

  useEffect(() => {
    if (data) {
      setFields(data);
    }
  }, [data, setFields]);

  const handleDelete = async (fieldId: string) => {
    try {
      await deleteField(fieldId);
      removeField(fieldId); // optimistic local update after confirmed delete
      toast.success("Field deleted");
    } catch {
      toast.error("Failed to delete field");
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
        {fields.map((field) => (
          <FieldCard
            key={field.id}
            field={field}
            isSelected={field.id === selectedFieldId}
            onClick={() => selectField(field.id)}
            onDelete={() => handleDelete(field.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BuilderCanvas;
