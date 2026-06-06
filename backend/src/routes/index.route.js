// Importing moduels
import express from "express";
import authRouter from "./auth.route.js";
import chatRouter from "./chat.route.js";

// Configuring the index Router
const indexRouter = express.Router();

// Adding the branch routes
indexRouter.use("/auth", authRouter);
indexRouter.use("/chats", chatRouter);

export default indexRouter;
