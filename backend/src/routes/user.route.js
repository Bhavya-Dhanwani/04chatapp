// Importing modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import { changePasswordController, changeProfilePicController } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// Making the router
const userRouter = express.Router();

// PATCH /api/users/me/password  - change current user's password (requires access token)
userRouter.patch("/me/password", authMiddleware(), asyncWraper(changePasswordController));

// PATCH /api/users/me/profile-pic  - change current user's profile picture URL (requires access token)
userRouter.patch("/me/profile-pic", authMiddleware(), asyncWraper(changeProfilePicController));

export default userRouter;
