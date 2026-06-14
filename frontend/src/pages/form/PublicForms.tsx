import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicForm } from "../../services/form.service";
import type { FormWithFields } from "../../types/form.types";

const PublicFormPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<FormWithFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getPublicForm(slug)
      .then((res) => setForm(res.data.data))
      .catch(() => setError("Form not found or unavailable."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PublicFormSkeleton />;
  if (error || !form) return <PublicFormError message={error ?? "Form not found."} />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Form header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-text-primary">{form.title}</h1>
          {form.description && (
            <p className="text-text-secondary text-sm">{form.description}</p>
          )}
        </div>

        {/* Fields — placeholder for now, wired up in submission step */}
        <div className="space-y-4">
          {form.fields.map((field) => (
            <div
              key={field.id}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <p className="text-sm font-medium text-text-primary">{field.label}</p>
              {field.description && (
                <p className="text-xs text-text-secondary mt-0.5">{field.description}</p>
              )}
              {/* Actual inputs come in submission step */}
              <div className="mt-2 h-9 bg-background border border-border rounded-lg" />
            </div>
          ))}
        </div>

        <button className="w-full py-2.5 bg-primary text-background text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
          Submit
        </button>
      </div>
    </div>
  );
};

export default PublicFormPage;

const PublicFormSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 animate-pulse">
    <div className="w-full max-w-2xl space-y-6">
      <div className="h-8 bg-surface rounded-lg w-1/2" />
      <div className="h-4 bg-surface rounded w-3/4" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-2">
          <div className="h-4 bg-background rounded w-1/3" />
          <div className="h-9 bg-background rounded-lg" />
        </div>
      ))}
      <div className="h-10 bg-surface rounded-xl" />
    </div>
  </div>
);

const PublicFormError = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-2">
      <p className="text-text-primary font-medium">Something went wrong</p>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  </div>
);