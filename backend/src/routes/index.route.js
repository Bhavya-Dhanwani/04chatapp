// Importing moduels
import express from "express";
import authRouter from "./auth.route.js";

// Configuring the index Router
const indexRouter = express.Router();

// Adding the branch routes
indexRouter.use("/auth", authRouter);

export default indexRouter;
