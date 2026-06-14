import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import BuilderLayout from "../../components/form/layyout/BuilderLayout";
import FieldPicker from "../../components/form/leftPanel/FieldPicker";
import FormCanvas from "../../components/form/middle/FormCanvas";
import FieldSettings from "../../components/form/right/FieldSettings";

import { getFormById } from "../../services/form.service";
import {
  getFieldsByFormId,
  createField,
  deleteField,
  updateField,
} from "../../services/form-fields.services";
import { publishForm } from "../../services/form.service";

import type { Form } from "../../types/form.types";
import type {
  FormField,
  FieldType,
  CreateFieldPayload,
  UpdateFieldPayload,
} from "../../types/form-fields.types";

type SaveStatus = "saved" | "saving" | "unsaved";

const FormBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const { status } = useAuth();

  // ── Form state ─────────────────────────────────────────────
  const [form, setForm] = useState<Form | null>(null);
  const [formLoading, setFormLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Fields state ───────────────────────────────────────────
  const [fields, setFields] = useState<FormField[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);

  // ── Selection state ────────────────────────────────────────
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // ── Save / publish state ───────────────────────────────────
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch Form
  useEffect(() => {
    if (!id || status !== "authenticated") return; // ← gate here
    setFormLoading(true);
    getFormById(id)
      .then((res) => setForm(res.data.data))
      .catch(() => setFormError("Failed to load form."))
      .finally(() => setFormLoading(false));
  }, [id, status]); // ← add status to deps

  //  Fetch fields
  useEffect(() => {
    if (!id || status !== "authenticated") return; // ← gate here
    setFieldsLoading(true);
    getFieldsByFormId(id)
      .then((res) => {
        const sorted = [...(res.data.data ?? [])].sort((a, b) =>
          a.displayOrder.localeCompare(b.displayOrder),
        );
        setFields(sorted);
      })
      .finally(() => setFieldsLoading(false));
  }, [id, status]); // ← add status to deps

  // ── Add field ──────────────────────────────────────────────
  const OPTION_TYPES: FieldType[] = [
    "single_select",
    "multi_select",
    "dropdown",
  ];


const handleAddField = useCallback(
    async (type: FieldType) => {
      if (!id) return;
      setSaveStatus("saving");
      const payload: CreateFieldPayload = {
        type,
        label: defaultLabelForType(type),
        ...(OPTION_TYPES.includes(type) && {
          options: [
            { label: "Option 1", value: "option_1" },
            { label: "Option 2", value: "option_2" },
          ],
        }),
      };
      try {
        const res = await createField(id, payload);
        const newField = res.data.data;
        setFields((prev) =>
          [...prev, newField].sort((a, b) =>
            a.displayOrder.localeCompare(b.displayOrder),
          ),
        );
        setSelectedFieldId(newField.id);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    },
    [id],
  );

  console.log("FIELDS:", fields);

  // Reorder Form-fileds handler
  const handleReorderFields = useCallback((reordered: FormField[]) => {
    setFields(reordered);
  }, []);

  // ── Delete field ───────────────────────────────────────────
  const handleDeleteField = useCallback(
    async (fieldId: string) => {
      if (!id) return;
      setSaveStatus("saving");
      try {
        await deleteField(id, fieldId);
        setFields((prev) => prev.filter((f) => f.id !== fieldId));
        if (selectedFieldId === fieldId) setSelectedFieldId(null);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    },
    [id, selectedFieldId],
  );

  // ── Update field ───────────────────────────────────────────
  const handleUpdateField = useCallback(
    async (fieldId: string, payload: UpdateFieldPayload) => {
      if (!id) return;
      setSaveStatus("saving");
      try {
        const res = await updateField(id, fieldId, payload);
        console.log("UPdateFiled Response:", res.data);
        const updated = res.data.data;

        if (!updated) {
          setSaveStatus("saved");
          return;
        }
        setFields((prev) => prev.map((f) => (f.id === fieldId ? updated : f)));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    },
    [id],
  );

  // ── Publish ────────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    if (!id || !form) return;
    setIsPublishing(true);
    try {
      const res = await publishForm(id, {
        visibility: form.visibility ?? "public",
      });
      setForm(res.data.data.form);
      console.log("FORRRRMMM:", res)
    } finally {
      setIsPublishing(false);
    }
  }, [id, form]);

  // ── Selected field object ──────────────────────────────────
  const selectedField = fields.find((f) => f?.id === selectedFieldId) ?? null;

  // ── Loading / error states ─────────────────────────────────
  if (status === "loading" || formLoading) return <BuilderSkeleton />;
  if (formError || !form)
    return <BuilderError message={formError ?? "Form not found."} />;

  return (
    <BuilderLayout
      formId={id!}
      formTitle={form.title}
      saveStatus={saveStatus}
      isPublished={form.isPublished}
      onPublish={handlePublish}
      isPublishing={isPublishing}
      leftPanel={<FieldPicker onAddField={handleAddField} />}
      canvas={
        <FormCanvas
          formId={id!}
          fields={fields}
          loading={fieldsLoading}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onDeleteField={handleDeleteField}
          onReorderFields={handleReorderFields}
        />
      }
      rightPanel={
        // Right panel wired up in next step
        <FieldSettings
          field={selectedField}
          onUpdateField={handleUpdateField}
        />
      }
    />
  );
};

export default FormBuilder;

// ── Helpers ────────────────────────────────────────────────────

function defaultLabelForType(type: FieldType): string {
  const map: Record<FieldType, string> = {
    short_text: "Short Answer",
    long_text: "Long Answer",
    email: "Email Address",
    number: "Number",
    date: "Date",
    single_select: "Single Choice",
    multi_select: "Multiple Choice",
    dropdown: "Dropdown",
    rating: "Rating",
    boolean: "Yes / No",
  };
  return map[type] ?? "Untitled Field";
}

// ── Skeleton ────────────────────────────────────────────────────

const BuilderSkeleton = () => (
  <div className="h-screen w-screen flex flex-col bg-background animate-pulse">
    <div className="h-14 bg-surface border-b border-border" />
    <div className="flex flex-1 overflow-hidden">
      <div className="w-64 bg-surface border-r border-border" />
      <div className="flex-1 bg-background" />
      <div className="w-72 bg-surface border-l border-border" />
    </div>
  </div>
);

// ── Error ───────────────────────────────────────────────────────

const BuilderError = ({ message }: { message: string }) => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-2">
      <p className="text-text-primary font-medium">Something went wrong</p>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  </div>
);
