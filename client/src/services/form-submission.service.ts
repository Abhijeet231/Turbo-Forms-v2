import api from "@/services/api";
import type {
    SubmitFormInput,
    FormSubmission,
    SubmissionWithAnswers,
} from "@/schemas/form-submission";

// *** Public *** 

// POST /api/v1/forms/:formId/submit
export const submitForm = async (formId: string, data: SubmitFormInput): Promise<FormSubmission> => {
    const response = await api.post(`/api/v1/forms/${formId}/submit`, data);
    return response.data;
};

// *** Protected  ***

// GET /api/v1/submissions/form/:formId
export const getFormSubmissions = async (formId: string): Promise<FormSubmission[]> => {
    const response = await api.get(`/api/v1/submissions/form/${formId}`);
    return response.data;
};

// GET /api/v1/submissions/:submissionId
export const getSubmissionById = async (submissionId: string): Promise<SubmissionWithAnswers> => {
    const response = await api.get(`/api/v1/submissions/${submissionId}`);
    return response.data;
};
