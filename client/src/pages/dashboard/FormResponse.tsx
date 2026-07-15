// dashboard/forms/:id/responses — per-form responses view for the owner.
// Standalone page (outside the dashboard layout), matching FormPreview's chrome.
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Inbox, Loader2, ChevronRight } from "lucide-react";

import { useGetFormsById } from "@/hooks/form/useGetFormById";
import { useGetFormSubmissions } from "@/hooks/form-submission/useGetFormSubmissions";
import { useGetSubmissionById } from "@/hooks/form-submission/useGetSubmissionById";
import { useGetAllFields } from "@/hooks/form-field/useGetAllFields";

import type { FormField } from "@/schemas/form-field.schema";
import { formatAnswer, formatDate } from "@/lib/submissionFormat";

// Detail panel — mounted only when a response is selected so it fetches on demand.
const ResponseDetail = ({
  submissionId,
  fields,
}: {
  submissionId: string;
  fields: FormField[];
}) => {
  const { data, isLoading, error } = useGetSubmissionById(submissionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="py-16 text-center text-sm text-red-400">
        {error ?? "Could not load this response."}
      </p>
    );
  }

  const answerByField = new Map(data.answers.map((a) => [a.field_id, a.value]));
  const ordered = [...fields].sort((a, b) => a.order.localeCompare(b.order));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-medium text-white/90">Response detail</h3>
          <p className="text-xs text-white/40">{formatDate(data.created_at)}</p>
        </div>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/50">
          {data.answers.length} answered
        </span>
      </div>

      <dl className="flex flex-col gap-4">
        {ordered.map((field) => {
          const raw = answerByField.get(field.id);
          const answered = raw != null;
          return (
            <div key={field.id} className="flex flex-col gap-1">
              <dt className="text-xs font-medium text-white/40">
                {field.label}
                {field.is_required && <span className="ml-1 text-pink-400">*</span>}
              </dt>
              <dd
                className={`whitespace-pre-wrap text-sm ${
                  answered ? "text-white/90" : "italic text-white/25"
                }`}
              >
                {answered ? formatAnswer(field, raw) : "Not answered"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

const FormResponse = () => {
  const { id } = useParams<{ id: string }>();

  const { data: form, isLoading: formLoading } = useGetFormsById(id!);
  const { data: submissions, isLoading: subsLoading } = useGetFormSubmissions(id!);
  const { data: fields } = useGetAllFields(id!);

  const [submissionId, setSubmissionId] = useState("");

  const ordered = [...submissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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

        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Inbox size={15} className="shrink-0 text-pink-500" />
          <span className="truncate font-medium text-white/80">
            {formLoading ? "Responses" : `${form?.title || "Untitled form"} — Responses`}
          </span>
        </div>
      </header>

      {/* body */}
      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
        <div className="grid w-full max-w-4xl gap-5 md:grid-cols-[300px_1fr]">
          {/* responses list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-white/80">Responses</h2>
              {!subsLoading && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/50">
                  {ordered.length}
                </span>
              )}
            </div>

            {subsLoading ? (
              <div className="flex items-center justify-center py-12 text-white/40">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : ordered.length === 0 ? (
              <p className="rounded-lg border border-dashed border-white/10 py-10 text-center text-sm text-white/40">
                No responses yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {ordered.map((s, i) => {
                  const active = s.id === submissionId;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSubmissionId(s.id)}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3.5 py-3 text-left transition-colors ${
                          active
                            ? "border-pink-500/60 bg-pink-500/5"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white/90">
                            Response #{ordered.length - i}
                          </p>
                          <p className="truncate text-xs text-white/40">
                            {formatDate(s.created_at)}
                          </p>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 ${
                            active ? "text-pink-500" : "text-white/30"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* detail */}
          <div className="rounded-xl border border-white/10 bg-white/2 p-5">
            {submissionId ? (
              <ResponseDetail submissionId={submissionId} fields={fields} />
            ) : (
              <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-white/40">
                <Inbox className="h-8 w-8 opacity-40" />
                <p className="text-sm">
                  {ordered.length > 0
                    ? "Select a response to view its answers."
                    : "Responses will appear here once people submit."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormResponse;
