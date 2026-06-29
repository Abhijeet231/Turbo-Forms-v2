import { z } from "zod";

const submitAnswerSchema = z.object({
    field_id: z.string().uuid("field_id must be a valid UUID"),
    value   : z.string().min(1, "Answer value cannot be empty"),
});

export const submitFormSchema = z.object({
    answers: z
        .array(submitAnswerSchema)
        .min(1, "At least one answer is required"),
});

export type SubmitFormInput    = z.infer<typeof submitFormSchema>;
export type SubmitAnswerInput  = z.infer<typeof submitAnswerSchema>;
