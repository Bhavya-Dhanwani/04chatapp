// Importing modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import { changePasswordController, changeProfilePicController, getRandomUsersController, searchUsersController } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// Making the router
const userRouter = express.Router();

// GET /api/users/search?q=query  - search users by name (requires verified access token)
userRouter.get("/search", authMiddleware(), asyncWraper(searchUsersController));

// GET /api/users/random  - return a random sample of verified users (requires verified access token)
userRouter.get("/random", authMiddleware(), asyncWraper(getRandomUsersController));

// PATCH /api/users/me/password  - change current user's password (requires access token)
userRouter.patch("/me/password", authMiddleware(), asyncWraper(changePasswordController));

// PATCH /api/users/me/profile-pic  - change current user's profile picture URL (requires access token)
userRouter.patch("/me/profile-pic", authMiddleware(), asyncWraper(changeProfilePicController));

export default userRouter;
