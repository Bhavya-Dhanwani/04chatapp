// Importing the modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import { forgotPasswordController, loginController, logoutAllController, logoutController, otpCheckController, resendOtpController, signupController } from "../controllers/auth.controller.js";
import getRefresh from "../middlewares/refresh.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// Making the router
const authRouter = express.Router();

// Adding the routes
authRouter.post("/signup", asyncWraper(signupController));
authRouter.post("/login", asyncWraper(loginController));
authRouter.delete("/logout", getRefresh, asyncWraper(logoutController));
authRouter.delete("/logoutall", getRefresh, asyncWraper(logoutAllController));
authRouter.post("/verify", authMiddleware(true), getRefresh, asyncWraper(otpCheckController));
authRouter.post("/resendOtp", authMiddleware(true), getRefresh, asyncWraper(resendOtpController));
authRouter.post("/forgotpassword", authMiddleware(), getRefresh, asyncWraper(forgotPasswordController));

export default authRouter;
