import { useSortable } from "@dnd-kit/sortable";

interface DragHandleProps {
  listeners: ReturnType<typeof useSortable>["listeners"];
  attributes: ReturnType<typeof useSortable>["attributes"];
}

const DragHandle = ({ listeners, attributes }: DragHandleProps) => {
  return (
    <button
      {...listeners}
      {...attributes}
      className="flex items-center justify-center w-6 h-6 rounded
        text-text-tertiary hover:text-text-secondary
        hover:bg-surface-hover transition-colors duration-150
        cursor-grab active:cursor-grabbing focus:outline-none
        focus-visible:ring-2 focus-visible:ring-border-strong"
      aria-label="Drag to reorder"
      tabIndex={0}
    >
      <i className="ti ti-grip-vertical text-base" aria-hidden="true" />
    </button>
  );
};

export default DragHandle;