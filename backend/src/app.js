// Importing modules 
import express from "express";
import connectDB from "./config/db.config.js";

// Initializing app
const app = express();

// Connecting to the database
connectDB();

export default app;
