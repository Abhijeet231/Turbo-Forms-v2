// Public form page: /f/:slug
// Anonymous respondents view a published form and submit a response.
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { useGetPublicForm } from "@/hooks/form/useGetPublicForm";
import { useSubmitForm } from "@/hooks/form-submission/useSubmitForm";
import FormRenderer from "@/components/formRenderer/FormRenderer";
import type { SubmitAnswerInput } from "@/schemas/form-submission";

const FormPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: form, isLoading, error } = useGetPublicForm(slug!);
  const { mutate: submit, isLoading: submitting } = useSubmitForm(form?.id ?? "");

  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(0); // bump to remount FormRenderer (clears answers)

  const handleSubmit = async (answers: SubmitAnswerInput[]) => {
    if (answers.length === 0) {
      toast.error("Please answer at least one field");
      return;
    }
    try {
      await submit({ answers });
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const submitAnother = () => {
    setSubmitted(false);
    setAttempt((n) => n + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <main className="flex flex-1 justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {isLoading ? (
            <p className="mt-10 text-center text-sm text-white/40">Loading…</p>
          ) : error || !form ? (
            <div className="mt-16 flex flex-col items-center gap-2 text-center text-white/50">
              <p className="text-lg font-medium text-white/80">Form not available</p>
              <p className="text-sm">
                This form may be unpublished or the link is incorrect.
              </p>
            </div>
          ) : submitted ? (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 size={48} className="text-pink-500" />
              <div>
                <h1 className="text-xl font-semibold text-white">Thank you!</h1>
                <p className="mt-1 text-sm text-white/50">
                  Your response has been recorded.
                </p>
              </div>
              <button
                onClick={submitAnother}
                className="mt-2 text-sm text-pink-400 underline-offset-2 hover:underline"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <FormRenderer
              key={attempt}
              form={form}
              fields={form.fields}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-white/25">
        Powered by Turbo Forms
      </footer>
    </div>
  );
};

export default FormPage;
