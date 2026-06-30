import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-xl py-16 px-6">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
        <FilePlus2 className="w-6 h-6 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">No forms yet</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-sm">
        Get started by creating your first form. Build and share custom data
        collection structures in seconds.
      </p>

      <Button onClick={onCreateClick} className="mt-6">
        Create Your First Form
      </Button>
    </div>
  );
};

export default EmptyState;