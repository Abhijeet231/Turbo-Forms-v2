import BuilderNavbar from "./BuilderNavbar";

type SaveStatus = "saved" | "saving" | "unsaved";

interface BuilderLayoutProps {
  // Navbar props
  formId: string;
  formTitle: string;
  saveStatus: SaveStatus;
  isPublished: boolean;
  onPublish: () => void;
  isPublishing: boolean;

  // Panel slots
  leftPanel: React.ReactNode;
  canvas: React.ReactNode;
  rightPanel: React.ReactNode;
}

const BuilderLayout = ({
  formId,
  formTitle,
  saveStatus,
  isPublished,
  onPublish,
  isPublishing,
  leftPanel,
  canvas,
  rightPanel,
}: BuilderLayoutProps) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Top navbar */}
      <BuilderNavbar
        formId={formId}
        formTitle={formTitle}
        saveStatus={saveStatus}
        isPublished={isPublished}
        onPublish={onPublish}
        isPublishing={isPublishing}
      />

      {/* 3-panel body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Field picker */}
        <aside className="w-64 shrink-0 bg-surface border-r border-border flex flex-col overflow-y-auto">
          {leftPanel}
        </aside>

        {/* MIDDLE — Canvas */}
        <main className="flex-1 overflow-y-auto bg-background">
          {canvas}
        </main>

        {/* RIGHT — Settings panel */}
        <aside className="w-72 shrink-0 bg-surface border-l border-border flex flex-col overflow-y-auto">
          {rightPanel}
        </aside>

      </div>
    </div>
  );
};

export default BuilderLayout;