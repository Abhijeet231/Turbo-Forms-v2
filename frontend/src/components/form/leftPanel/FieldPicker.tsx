import type { FieldType } from "../../../types/form-fields.types";

interface FieldPickerProps {
  onAddField: (type: FieldType) => Promise<void>;
}

const FieldPicker = ({ onAddField }: FieldPickerProps) => {
  return <div>FieldPicker</div>;
};

export default FieldPicker;