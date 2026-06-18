import rateLimit from "express-rate-limit";

// Setting up rate limiting for sensitive auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many attempts from this IP, please try again after 15 minutes"
});

export default authLimiter;
