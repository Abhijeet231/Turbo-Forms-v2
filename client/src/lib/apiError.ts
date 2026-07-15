import { AxiosError } from "axios";

// Pull the server's error message out of an API failure. Our API returns
// `{ error: string }` on 4xx (e.g. validation failures), so prefer that and
// fall back to a caller-supplied message for network/unknown errors.
export const getApiErrorMessage = (err: unknown, fallback: string): string => {
    if (err instanceof AxiosError) {
        const msg = (err.response?.data as { error?: string } | undefined)?.error;
        if (typeof msg === "string" && msg.trim()) return msg;
    }
    return fallback;
};
