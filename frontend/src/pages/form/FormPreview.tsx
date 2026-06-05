import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { previewForm } from "../../services/form.service";
import type { FormWithFields } from "../../types/form.types";

const FormPreview = () => {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState<FormWithFields | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPreview = async () => {
            try {
                const res = await previewForm(id);
                setForm(res.data.data);
                console.log("RESSS:", res.data.data)
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Failed to load preview");
            } finally {
                setLoading(false);
            }
        };

        fetchPreview();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading preview...
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error ?? "Form not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Preview Banner */}
            <div className="bg-amber-400 text-amber-900 text-sm font-medium text-center py-2">
                Preview Mode 
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Form Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
                    {form.description && (
                        <p className="mt-2 text-gray-500 text-sm">{form.description}</p>
                    )}
                </div>

                {/* Fields */}
                <div className="space-y-6">
                    {form.fields.length === 0 && (
                        <p className="text-gray-400 text-sm">No fields added yet.</p>
                    )}

                    {form.fields.map((field) => (
                        <div key={field.id} className="bg-white rounded-xl border border-gray-200 p-5">
                            <label className="block text-sm font-medium text-gray-800 mb-1">
                                {field.label}
                                {field.isRequired && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>

                            {field.description && (
                                <p className="text-xs text-gray-400 mb-2">{field.description}</p>
                            )}

                            {/* Render input based on type */}
                            {(field.type === "short_text" || field.type === "email" || field.type === "number" || field.type === "date") && (
                                <input
                                    disabled
                                    type={field.type === "short_text" ? "text" : field.type}
                                    placeholder={field.placeholder ?? ""}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            )}

                            {field.type === "long_text" && (
                                <textarea
                                    disabled
                                    placeholder={field.placeholder ?? ""}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed resize-none"
                                />
                            )}

                            {(field.type === "single_select" || field.type === "dropdown") && (
                                <div className="space-y-2">
                                    {field.options?.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-500">
                                            <input type="radio" disabled className="accent-gray-400" />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {field.type === "multi_select" && (
                                <div className="space-y-2">
                                    {field.options?.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-500">
                                            <input type="checkbox" disabled className="accent-gray-400" />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {field.type === "boolean" && (
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" disabled /> Yes
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" disabled /> No
                                    </label>
                                </div>
                            )}

                            {field.type === "rating" && (
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button key={n} disabled className="w-8 h-8 rounded-full border border-gray-200 text-sm text-gray-400 cursor-not-allowed">
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                {form.fields.length > 0 && (
                    <div className="mt-8">
                        <button
                            disabled
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium opacity-40 cursor-not-allowed"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormPreview;