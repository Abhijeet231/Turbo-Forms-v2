import { Link } from "react-router-dom";
import { Eye, Share2, ChevronRight, Check, Loader2, CloudOff, X } from "lucide-react";

type SaveStatus = "saved" | "saving" | "unsaved";

interface BuilderNavbarProps {
  formId: string;
  formTitle: string;
  formSlug: string;
  saveStatus: SaveStatus;
  isPublished: boolean;
  onPublish: () => void;
  isPublishing: boolean;
  justPublished: boolean;
  onDismissPublished: () => void;
}

const SaveIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Loader2 size={12} className="animate-spin" />
        Saving...
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Check size={12} className="text-success" />
        Saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-text-secondary">
      <CloudOff size={12} className="text-danger" />
      Unsaved
    </span>
  );
};

const BuilderNavbar = ({
  formId,
  formTitle,
  formSlug,
  saveStatus,
  isPublished,
  onPublish,
  isPublishing,
  justPublished,
  onDismissPublished,
}: BuilderNavbarProps) => {

  const publicUrl = `${window.location.origin}/f/${formSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
  };

  return (
    <>
      <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
        {/* LEFT — Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            to="/dashboard"
            className="text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Dashboard
          </Link>
          <ChevronRight size={14} className="text-border" />
          <span className="text-text-primary font-medium truncate max-w-50">
            {formTitle || "Untitled Form"}
          </span>
        </nav>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} />

          <div className="h-4 w-px bg-border" />

          {/* Preview */}
          <Link
            to={`/forms/${formId}/preview`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary border border-border hover:border-primary/40 rounded-xl px-3 py-1.5 transition-all duration-150"
          >
            <Eye size={14} />
            Preview
          </Link>

          {/* Share — only usable once published */}
          <button
            onClick={handleCopy}
            disabled={!isPublished}
            title={!isPublished ? "Publish the form first to get a shareable link" : "Copy link"}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary border border-border hover:border-primary/40 rounded-xl px-3 py-1.5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Share2 size={14} />
            Share
          </button>

          {/* Publish */}
          <button
            onClick={onPublish}
            disabled={isPublishing || isPublished}
            className={`
              flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-xl transition-all duration-150
              ${isPublished
                ? "bg-success/10 text-success border border-success/30 cursor-default"
                : "bg-primary text-background hover:bg-primary/90"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isPublishing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isPublished ? (
              <Check size={14} />
            ) : null}
            {isPublished ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      {/* "Form is live" modal — rendered outside the header so it overlays everything */}
      {justPublished && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onDismissPublished}
        >
          <div
            className="bg-surface border border-border rounded-2xl p-6 w-105 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Check size={16} className="text-success" />
                </div>
                <span className="font-semibold text-text-primary">Your form is live!</span>
              </div>
              <button
                onClick={onDismissPublished}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-text-secondary">
              Anyone with the link below can now fill out your form.
            </p>

            {/* URL row */}
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
              <span className="flex-1 text-sm text-text-secondary truncate">
                {publicUrl}
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
              >
                Copy
              </button>
            </div>

            {/* Done */}
            <button
              onClick={onDismissPublished}
              className="w-full text-sm py-2 rounded-xl bg-primary text-background hover:bg-primary/90 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BuilderNavbar;