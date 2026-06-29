import { z } from "zod";

// ***  Submit Form Schema *** 

// tis is schema for one single answer
const submitAnswerSchema = z.object({
    field_id: z.uuid("field_id must be a valid UUID"),
    value: z.string().min(1, "Answer cannot be empty"),
});

// this is the whole submission payload schema
export const submitFormSchema = z.object({
    answers: z
        .array(submitAnswerSchema)
        .min(1, "At least one answer is required"),
});

// ***  Response Types (what backend sends back) *** 

// what backend returns after submit
export type FormSubmission = {
    id: string;
    form_id: string;
    created_at: string;
};

// type of one stored answer row
export type SubmissionAnswer = {
    id: string;
    submission_id: string;
    field_id: string;
    value: string;
    created_at: string;
};

// matches SubmissionWithAnswers from backend
export type SubmissionWithAnswers = FormSubmission & {
    answers: SubmissionAnswer[];
};

// *** Exported Types ***

export type SubmitFormInput = z.infer<typeof submitFormSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
