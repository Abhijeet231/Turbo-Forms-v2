import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormSchema, type CreateFormInput } from "@/schemas/form.schema";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useCreateForm } from "@/hooks/form/useCreateForm";

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFormModal = ({ isOpen, onClose }: CreateFormModalProps) => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useCreateForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormInput>({
    resolver: zodResolver(createFormSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateFormInput) => {
    try {
      const newForm = await mutate(data);
      toast.success("Form Created Successfully");
      reset();
      onClose();
      navigate(`/dashboard/forms/${newForm.id}/edit`);
    } catch (error) {
      toast.error("Failed to create form. Please try again.");
    }
  };

  return (
  <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-zinc-900 border border-white/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-semibold text-white mb-4">Create Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter your form title"
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm text-gray-400 mb-1">
              Description <span className="text-gray-600">(optional)</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter your form description"
              rows={3}
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Creating..." : "Create Form"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFormModal;
