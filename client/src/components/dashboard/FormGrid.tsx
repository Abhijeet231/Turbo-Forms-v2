import type { Form } from "@/schemas/form.schema";
import FormCard from "./FormCard";

interface FormGridProps {
  forms: Form[];
}

const FormGrid = ({ forms }: FormGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default FormGrid;