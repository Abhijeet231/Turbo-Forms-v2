import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Copy, ExternalLink, Eye, Globe, Loader2 } from "lucide-react";

import { useGetFormsById } from "@/hooks/form/useGetFormById";
import { useUpdateForm } from "@/hooks/form/useUpdateForm";
import { usePublishForm } from "@/hooks/form/usePublishForm";
import { useUnpublishForm } from "@/hooks/form/useUnpublishForm";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { UpdateFormInput } from "@/schemas/form.schema";

const BuilderHeader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: form, isLoading } = useGetFormsById(id!);
  const { mutate: updateForm } = useUpdateForm(id!);
  const { mutate: publish, isLoading: publishing } = usePublishForm(id!);
  const { mutate: unpublish, isLoading: unpublishing } = useUnpublishForm(id!);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description ?? "");
      setIsPublished(form.is_published);
    }
  }, [form]);

  const debouncedSave = useDebouncedCallback((patch: UpdateFormInput) => {
    updateForm(patch).catch(() => toast.error("Failed to save form"));
  }, 600);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (value.trim()) debouncedSave({ title: value });
  };

  const onDescriptionChange = (value: string) => {
    setDescription(value);
    debouncedSave({ description: value });
  };

  const handlePublishToggle = async () => {
    try {
      if (isPublished) {
        await unpublish();
        setIsPublished(false);
        toast.success("Form unpublished");
      } else {
        // the server only publishes forms whose visibility is "public",
        // so flip visibility first for a true one-click publish
        if (form?.visibility !== "public") {
          await updateForm({ visibility: "public" });
        }
        await publish();
        setIsPublished(true);
        toast.success("Form published");
      }
    } catch {
      toast.error(isPublished ? "Failed to unpublish" : "Failed to publish");
    }
  };

  const isToggling = publishing || unpublishing;

  const publicUrl = form?.slug ? `${window.location.origin}/f/${form.slug}` : "";

  const copyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-800 px-5 py-3">
      {/* left: back + editable title/description */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="shrink-0 rounded-md p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/90"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
          ) : (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Untitled form"
                className="w-full truncate rounded border border-transparent bg-transparent px-1 text-sm font-semibold text-white/90 hover:border-white/10 focus:border-pink-500/40 focus:outline-none"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Add a description"
                className="w-full truncate rounded border border-transparent bg-transparent px-1 text-xs text-white/40 hover:border-white/10 focus:border-pink-500/40 focus:outline-none"
              />
            </>
          )}
        </div>
      </div>

      {/* right: status + preview + publish */}
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isPublished ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPublished ? "bg-green-400" : "bg-white/30"
            }`}
          />
          {isPublished ? "Published" : "Draft"}
        </span>

        {isPublished && publicUrl && (
          <>
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/5"
            >
              <Copy size={14} />
              Copy link
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-white/10 p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white/90"
              aria-label="Open live form in new tab"
            >
              <ExternalLink size={15} />
            </a>
          </>
        )}

        <Link
          to={`/dashboard/forms/${id}/preview`}
          className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/5"
        >
          <Eye size={15} />
          Preview
        </Link>

        <button
          type="button"
          onClick={handlePublishToggle}
          disabled={isToggling}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
            isPublished
              ? "border border-white/10 text-white/80 hover:bg-white/5"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
        >
          {isToggling ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
          {isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;
