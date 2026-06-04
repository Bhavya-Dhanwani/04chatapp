// Importing modules
import { config } from "dotenv";

// Configuring the env variables
config();

// exporting the env variables
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
export const ACCESS_SECRET = process.env.ACCESS_SECRET || "";
