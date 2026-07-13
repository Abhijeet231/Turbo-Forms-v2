import { useCallback, useEffect, useMemo, useRef } from "react";

type DebouncedFn<Args extends unknown[]> = ((...args: Args) => void) & {
    // run the pending call right now (used when we need to persist before switching context)
    flush: () => void;
    // drop the pending call
    cancel: () => void;
};

/**
 * Debounce a callback. The returned function is stable across renders and
 * exposes `flush()` (fire the pending call immediately) and `cancel()`.
 * The latest `callback` is always used, so closures never go stale.
 */
export function useDebouncedCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    delay: number
): DebouncedFn<Args> {
    const callbackRef = useRef(callback);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const argsRef = useRef<Args | null>(null);

    // keep the latest callback without touching refs during render
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const run = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (argsRef.current) {
            const args = argsRef.current;
            argsRef.current = null;
            callbackRef.current(...args);
        }
    }, []);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        argsRef.current = null;
    }, []);

    // build the callable once (methods attached to a locally-created fn, not a hook return)
    const debounced = useMemo(() => {
        const fn = ((...args: Args) => {
            argsRef.current = args;
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(run, delay);
        }) as DebouncedFn<Args>;
        fn.flush = run;
        fn.cancel = cancel;
        return fn;
    }, [delay, run, cancel]);

    // cleanup any pending timer on unmount
    useEffect(() => () => cancel(), [cancel]);

    return debounced;
}
