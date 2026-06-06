// Importing the modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { accessOrCreateChatController, getChatsController } from "../controllers/chat.controller.js";

// Making the router
const chatRouter = express.Router();

// Adding the routes (all chat routes require a verified authenticated user)
chatRouter.get("/", authMiddleware(), asyncWraper(getChatsController));

// POST /api/chats  - find or create a 1:1 chat with another user (body: { userId })
chatRouter.post("/", authMiddleware(), asyncWraper(accessOrCreateChatController));

export default chatRouter;
