import rateLimit, { type Options } from "express-rate-limit";

const jsonHandler = (message: string): Options["handler"] => (_req, res) => {
    res.status(429).json({ error: message });
};

// Baseline for every request (auth or not) — catches scripted abuse of a
// leaked/compromised token as well as unauthenticated traffic.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler("Too many requests, please try again later"),
});

// Public form submission is the highest-value abuse target (unauthenticated,
// writes to the DB) — kept much tighter than the general API limit.
export const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler("Too many submissions from this device, please try again later"),
});

// Public form browse/lookup (list + by-slug) — unauthenticated reads, looser
// than submissions but still worth capping.
export const publicReadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler("Too many requests, please try again later"),
});
