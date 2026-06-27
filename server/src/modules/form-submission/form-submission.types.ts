import type {
    SelectFormSubmission,
    SelectSubmissionAnswer,
} from "../../db/schema.js";


// shape returned by getSubmissionByIdService — submission + its answers joined
export interface SubmissionWithAnswers extends SelectFormSubmission {
    answers: SelectSubmissionAnswer[];
}
