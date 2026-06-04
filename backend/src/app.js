// Importing modules 
import express from "express";
import connectDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";

// Initializing app
const app = express();

// Connecting to the database
connectDB();

// Adding the middleware
app.use(express.json());
app.use(cookieParser());

// Adding the error middlewares
app.use(errorMiddleware);

export default app;
