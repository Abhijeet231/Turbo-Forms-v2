import {
    formSubmissionsTable,
    submissionAnswersTable,
    formsTable,
    formFieldsTable,
    usersTable
} from "../../db/schema.js";
import { db } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import { getDbUserByClerkId } from "../user/user.service.js";
import type { SubmitFormInput } from "./form-submission.validation.js";
import type { SelectFormField } from "../../db/schema.js";
import type { SubmissionWithAnswers } from "./form-submission.types.js";


// Value Validators


export const submitFormService = async (formId: string) => {

    // get formId and check if this exists in db or not
    // check if form is published or not.
    // fetch all fields for the form form db
    // check duplicate field_ids in the submitted answer (why ? and how to prevent one user or one ip to submit only one or should i leave it now . and where to add the rate-limiter . in route level or what ? like one usr can submit one type then have to wait 5 minutes to anothr round)
    // check all rquired fileds has answers or not



}