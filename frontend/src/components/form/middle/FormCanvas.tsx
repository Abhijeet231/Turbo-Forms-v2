import type { Dispatch, SetStateAction } from "react";
import type { FormField } from "../../../types/form-fields.types";

interface FormCanvasProps {
  fields: FormField[];
  loading: boolean;
  selectedFieldId: string | null;
  onSelectField: Dispatch<SetStateAction<string | null>>;
  onDeleteField: (fieldId: string) => Promise<void>;
}

const FormCanvas = ({ fields, loading, selectedFieldId, onSelectField, onDeleteField }: FormCanvasProps) => {
  return <div>FormCanvas</div>;
};

export default FormCanvas;