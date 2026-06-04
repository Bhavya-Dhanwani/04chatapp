// Importing the modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import { loginController, logoutAllController, logoutController, signupController } from "../controllers/auth.controller.js";
import getRefresh from "../middlewares/refresh.middleware.js";

// Making the router
const authRouter = express.Router();

// Adding the routes
authRouter.post("/signup", asyncWraper(signupController));
authRouter.post("/login", asyncWraper(loginController));
authRouter.delete("/logout", getRefresh, asyncWraper(logoutController));
authRouter.delete("/logoutall", getRefresh, asyncWraper(logoutAllController));

export default authRouter;
