import { Link } from "react-router-dom";
import { Eye, Share2, ChevronRight, Check, Loader2, CloudOff } from "lucide-react";

type SaveStatus = "saved" | "saving" | "unsaved";

interface BuilderNavbarProps {
  formId: string;
  formTitle: string;
  saveStatus: SaveStatus;
  isPublished: boolean;
  onPublish: () => void;
  isPublishing: boolean;
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
  saveStatus,
  isPublished,
  onPublish,
  isPublishing,
}: BuilderNavbarProps) => {
  return (
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
        {/* Save status */}
        <SaveIndicator status={saveStatus} />

        {/* Divider */}
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

        {/* Share */}
        <button
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary border border-border hover:border-primary/40 rounded-xl px-3 py-1.5 transition-all duration-150"
          onClick={() => {
            const slug = formId; // replace with actual slug if available
            navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`);
          }}
        >
          <Share2 size={14} />
          Share
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className={`
            flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-xl transition-all duration-150
            ${isPublished
              ? "bg-success/10 text-success border border-success/30 hover:bg-success/20"
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
  );
};

export default BuilderNavbar;