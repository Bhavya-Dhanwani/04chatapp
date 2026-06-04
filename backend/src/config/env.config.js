// Importing modules
import { config } from "dotenv";

// Configuring the env variables
config();

// exporting the env variables
export const PORT = process.env.PORT || 5000;
