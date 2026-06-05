// Importing modules
import { config } from "dotenv";

// Configuring the env variables
config();

// exporting the env variables
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
export const ACCESS_SECRET = process.env.ACCESS_SECRET || "";
export const SMTP_SERVICE = process.env.SMTP_SERVICE || "";
export const SMTP_PORT = process.env.SMTP_PORT || 587;
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const TRANSACTION_MAIL = process.env.TRANSACTIONAL_EMAIL || "";
export const FRONTEND_URL = process.env.FRONTEND_URL || "";
