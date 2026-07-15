// dashboard/submissions
// Owner-facing panel: pick a form, browse its responses, and inspect the
// answers of a single response. Read-only — all data comes from existing hooks.

import { useState } from "react";
import { Inbox, Loader2, FileText, ChevronRight } from "lucide-react";

import { useGetForms } from "@/hooks/form/useGetForms";
import { useGetFormSubmissions } from "@/hooks/form-submission/useGetFormSubmissions";
import { useGetSubmissionById } from "@/hooks/form-submission/useGetSubmissionById";
import { useGetAllFields } from "@/hooks/form-field/useGetAllFields";

import type { FormField } from "@/schemas/form-field.schema";
import { Badge } from "@/components/ui/badge";

// Turn a stored answer (field_id + raw string value) into something readable,
// using the field definition (options labels, boolean, rating, multi-select).
const formatAnswer = (field: FormField | undefined, value: string): string => {
  if (!field) return value;

  switch (field.type) {
    case "boolean":
      return value === "true" ? "Yes" : "No";

    case "single_select":
    case "dropdown":
      return field.options.find((o) => o.value === value)?.label ?? value;

    case "multi_select":
      try {
        const arr = JSON.parse(value) as string[];
        return arr
          .map((v) => field.options.find((o) => o.value === v)?.label ?? v)
          .join(", ");
      } catch {
        return value;
      }

    case "rating": {
      const max = field.validations?.maxRating ?? 5;
      return `${value} / ${max}`;
    }

    default:
      return value;
  }
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

// ── Detail panel ────────────────────────────────────────────────────────────
// Mounted only when a submission is selected, so the hook fetches on demand.
const SubmissionDetail = ({
  submissionId,
  fields,
}: {
  submissionId: string;
  fields: FormField[];
}) => {
  const { data, isLoading, error } = useGetSubmissionById(submissionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="py-16 text-center text-sm text-destructive">
        {error ?? "Could not load this response."}
      </p>
    );
  }

  // index answers by field so we can render in the form's field order
  const answerByField = new Map(data.answers.map((a) => [a.field_id, a.value]));
  const ordered = [...fields].sort((a, b) => a.order.localeCompare(b.order));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Response detail</h3>
          <p className="text-xs text-muted-foreground">{formatDate(data.created_at)}</p>
        </div>
        <Badge variant="secondary">{data.answers.length} answered</Badge>
      </div>

      <dl className="flex flex-col gap-4">
        {ordered.map((field) => {
          const raw = answerByField.get(field.id);
          const answered = raw != null;
          return (
            <div key={field.id} className="flex flex-col gap-1">
              <dt className="text-xs font-medium text-muted-foreground">
                {field.label}
                {field.is_required && <span className="ml-1 text-pink-500">*</span>}
              </dt>
              <dd
                className={`text-sm whitespace-pre-wrap ${
                  answered ? "text-foreground" : "italic text-muted-foreground/60"
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

// ── Page ──────────────────────────────────────────────────────────────────—─
const Submissions = () => {
  const { data: forms, isLoading: formsLoading } = useGetForms();

  const [formId, setFormId] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [seeded, setSeeded] = useState(false);

  // auto-select the first form once forms load (render-time sync avoids the
  // setState-in-effect lint and the extra render an effect would cause)
  if (!seeded && forms.length > 0) {
    setSeeded(true);
    setFormId(forms[0].id);
  }

  // these hooks no-op internally while their id is "" (not yet selected)
  const { data: submissions, isLoading: subsLoading } = useGetFormSubmissions(formId);
  const { data: fields } = useGetAllFields(formId);

  const onSelectForm = (id: string) => {
    setFormId(id);
    setSubmissionId(""); // reset the open response when switching forms
  };

  const ordered = [...submissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Inbox className="h-6 w-6 text-pink-500" />
          Submissions
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse the responses collected by your published forms.
        </p>
      </header>

      {formsLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading forms…
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-foreground/10 py-16 text-center text-muted-foreground">
          <FileText className="h-8 w-8 opacity-40" />
          <p className="text-sm">You haven’t created any forms yet.</p>
        </div>
      ) : (
        <>
          {/* form picker */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="form-picker"
              className="text-xs font-medium text-muted-foreground"
            >
              Form
            </label>
            <select
              id="form-picker"
              value={formId}
              onChange={(e) => onSelectForm(e.target.value)}
              className="w-full max-w-sm rounded-lg border border-foreground/10 bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
            >
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title || "Untitled form"}
                </option>
              ))}
            </select>
          </div>

          {/* master-detail */}
          <div className="grid gap-5 md:grid-cols-[320px_1fr]">
            {/* responses list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground">Responses</h2>
                {!subsLoading && (
                  <Badge variant="secondary">{ordered.length}</Badge>
                )}
              </div>

              {subsLoading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : ordered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-foreground/10 py-10 text-center text-sm text-muted-foreground">
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
                              : "border-foreground/10 hover:border-foreground/20 hover:bg-muted/40"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              Response #{ordered.length - i}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {formatDate(s.created_at)}
                            </p>
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 ${
                              active ? "text-pink-500" : "text-muted-foreground/50"
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
            <div className="rounded-xl border border-foreground/10 bg-card p-5">
              {submissionId ? (
                <SubmissionDetail submissionId={submissionId} fields={fields} />
              ) : (
                <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
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
        </>
      )}
    </div>
  );
};

export default Submissions;
