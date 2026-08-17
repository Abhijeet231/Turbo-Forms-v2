import { X } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: "How do I create a form?",
    answer:
      'Click "Create Form" on the dashboard, give it a title, then add fields from the palette in the builder and drag to reorder them.',
  },
  {
    question: "How do I publish a form?",
    answer:
      'Open the form in the builder and click "Publish". Your form must be set to public visibility before it can be published.',
  },
  {
    question: "Where do I find my form's public link?",
    answer:
      'Once published, use the "Copy link" button in the builder header to share the public URL with respondents.',
  },
  {
    question: "Where can I see responses?",
    answer:
      'Open "Submissions" in the sidebar, or the "Responses" entry point on a form card, to view collected answers.',
  },
];

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-zinc-900 border border-white/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-white">Help</h1>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map(({ question, answer }) => (
            <div key={question}>
              <p className="text-sm font-medium text-white">{question}</p>
              <p className="text-sm text-gray-400 mt-1">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
