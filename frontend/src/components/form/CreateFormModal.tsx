import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { createForm } from "../../services/form.service";
import { type Form } from "../../types/form.types";
import { useNavigate } from "react-router-dom";

interface CreateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (form: Form) => void;
}

interface FormState {
    title: string;
    description: string;
}

interface FormErrors {
    title?: string;
    description?: string;
    general?: string;
}

const CreateFormModal = ({ isOpen, onClose, onSuccess }: CreateFormModalProps) => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState<FormState>({
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formState.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formState.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
        // clear field error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await createForm({
                title: formState.title.trim(),
                description: formState.description.trim() || undefined,
            });
            const newForm = res.data.data.form;
            onSuccess(newForm);
            handleClose();
            navigate(`/forms/${newForm.id}/builder`);
        } catch (err: any) {
            const message = err?.response?.data?.message;
            if (err?.response?.status === 429) {
                setErrors({ general: "Too many forms created. Please slow down." });
            } else {
                setErrors({ general: message || "Something went wrong. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormState({ title: "", description: "" });
        setErrors({});
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#00000088" }}
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-md rounded-xl p-6"
                style={{
                    backgroundColor: "#1c1917",
                    border: "0.5px solid #292524",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-medium text-stone-100">Create a new form</h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                            You can add fields after creation
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-stone-500 hover:text-stone-300 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* General error */}
                {errors.general && (
                    <div
                        className="mb-4 px-3 py-2 rounded-lg text-xs"
                        style={{
                            backgroundColor: "#7f1d1d33",
                            border: "0.5px solid #7f1d1d",
                            color: "#fca5a5",
                        }}
                    >
                        {errors.general}
                    </div>
                )}

                {/* Title field */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">
                        Title <span className="text-orange-700">*</span>
                    </label>
                    <input
                        name="title"
                        type="text"
                        value={formState.title}
                        onChange={handleChange}
                        placeholder="e.g. Customer feedback survey"
                        autoFocus
                        className="w-full text-sm rounded-lg px-3 py-2.5 outline-none transition-colors"
                        style={{
                            backgroundColor: "#0f0f0f",
                            border: errors.title ? "0.5px solid #c2410c" : "0.5px solid #292524",
                            color: "#f5f5f4",
                        }}
                        onFocus={(e) =>
                            !errors.title &&
                            (e.currentTarget.style.borderColor = "#c2410c66")
                        }
                        onBlur={(e) =>
                            !errors.title &&
                            (e.currentTarget.style.borderColor = "#292524")
                        }
                    />
                    {errors.title && (
                        <p className="text-xs text-red-400 mt-1">{errors.title}</p>
                    )}
                </div>

                {/* Description field */}
                <div className="mb-6">
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">
                        Description{" "}
                        <span className="text-stone-600 font-normal">(optional)</span>
                    </label>
                    <textarea
                        name="description"
                        value={formState.description}
                        onChange={handleChange}
                        placeholder="What is this form about?"
                        rows={3}
                        className="w-full text-sm rounded-lg px-3 py-2.5 outline-none transition-colors resize-none"
                        style={{
                            backgroundColor: "#0f0f0f",
                            border: "0.5px solid #292524",
                            color: "#f5f5f4",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#c2410c66")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#292524")}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-sm text-stone-400 hover:text-stone-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
                        style={{ backgroundColor: loading ? "#9a3412" : "#c2410c" }}
                        onMouseEnter={(e) =>
                            !loading && (e.currentTarget.style.backgroundColor = "#9a3412")
                        }
                        onMouseLeave={(e) =>
                            !loading && (e.currentTarget.style.backgroundColor = "#c2410c")
                        }
                    >
                        {loading ? (
                            <>
                                <span
                                    className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                                />
                                Creating...
                            </>
                        ) : (
                            "Create form"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFormModal;