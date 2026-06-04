// Importing the modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import { loginController, signupController } from "../controllers/auth.controller.js";

// Making the router
const authRouter = express.Router();

// Adding the routes
authRouter.use("/signup", asyncWraper(signupController));
authRouter.use("/login", asyncWraper(loginController));

export default authRouter;
