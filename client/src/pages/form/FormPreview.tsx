// dashboard/forms/:id/preview — owner preview of how the form looks to respondents.
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";

import { useGetFormsById } from "@/hooks/form/useGetFormById";
import { useGetAllFields } from "@/hooks/form-field/useGetAllFields";
import FormRenderer from "@/components/formRenderer/FormRenderer";

const FormPreview = () => {
  const { id } = useParams<{ id: string }>();

  const { data: form, isLoading: formLoading, error: formError } = useGetFormsById(id!);
  const {
    data: fields,
    isLoading: fieldsLoading,
    error: fieldsError,
    refetch,
  } = useGetAllFields(id!);

  const isLoading = formLoading || fieldsLoading;
  const error = formError || fieldsError;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      {/* top bar */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-800 px-5 py-3">
        <Link
          to={`/dashboard/forms/${id}/edit`}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <ArrowLeft size={16} />
          Back to editor
        </Link>

        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/50">
          <Eye size={13} />
          Preview
        </span>
      </header>

      {/* body */}
      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
        <div className="w-full max-w-2xl">
          {isLoading ? (
            <p className="mt-10 text-center text-sm text-white/40">Loading preview…</p>
          ) : error || !form ? (
            <div className="mt-10 flex flex-col items-center gap-2 text-white/40">
              <p className="text-sm">{error ?? "Form not found"}</p>
              <button onClick={() => refetch()} className="text-sm underline">
                Retry
              </button>
            </div>
          ) : (
            <FormRenderer form={form} fields={fields} previewMode />
          )}
        </div>
      </main>
    </div>
  );
};

export default FormPreview;
