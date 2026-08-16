import { useEffect, useState } from "react";
import { getFormSubmissions } from "@/services/form-submission.service";
import type { Form } from "@/schemas/form.schema";

// Submission count per form, for stat tiles / charts. There's no aggregate
// count endpoint on the server, so this fans out one request per form —
// fine at current scale, revisit if an owner ends up with dozens of forms.
export const useSubmissionCounts = (forms: Form[]) => {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (forms.length === 0) return;

        let cancelled = false;
        setIsFetching(true);

        Promise.all(
            forms.map((form) =>
                getFormSubmissions(form.id)
                    .then((submissions) => [form.id, submissions.length] as const)
                    .catch(() => [form.id, 0] as const)
            )
        ).then((entries) => {
            if (cancelled) return;
            setCounts(Object.fromEntries(entries));
            setIsFetching(false);
        });

        return () => {
            cancelled = true;
        };
    }, [forms]);

    // no forms means nothing to fetch — don't report loading forever
    const isLoading = forms.length > 0 && isFetching;
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    return { counts, total, isLoading };
};
