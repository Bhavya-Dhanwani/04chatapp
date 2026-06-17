import { FRONTEND_URL } from "../config/env.config.js";

const DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];

const allowedOrigins = new Set(
    [FRONTEND_URL, ...DEFAULT_ALLOWED_ORIGINS]
        .flatMap((origin) => String(origin || "").split(","))
        .map((origin) => origin.trim())
        .filter(Boolean)
);

// CORS middleware
function corsMiddleware(req, res, next) {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
}

export default corsMiddleware;
