// Importing the modules
import express from "express";
import asyncWraper from "../utils/asyncwrapper.util.js";
import { forgotPasswordController, loginController, logoutAllController, logoutController, meController, otpCheckController, refreshController, resendOtpController, resetPasswordController, signupController, signupUploadAuthController } from "../controllers/auth.controller.js";
import getRefresh from "../middlewares/refresh.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authLimiter from "../middlewares/rateLimit.middleware.js";

// Making the router
const authRouter = express.Router();

// Adding the routes
authRouter.get("/signup/upload-auth", authLimiter, asyncWraper(signupUploadAuthController));
authRouter.post("/signup", authLimiter, asyncWraper(signupController));
authRouter.post("/login", authLimiter, asyncWraper(loginController));
authRouter.post("/refresh", authLimiter, getRefresh, asyncWraper(refreshController));
authRouter.delete("/logout", authLimiter, getRefresh, asyncWraper(logoutController));
authRouter.delete("/logoutall", authLimiter, getRefresh, asyncWraper(logoutAllController));
authRouter.post("/verify", authLimiter, authMiddleware(true), getRefresh, asyncWraper(otpCheckController));
authRouter.post("/resendOtp", authLimiter, authMiddleware(true), getRefresh, asyncWraper(resendOtpController));
authRouter.post("/forgotpassword", authLimiter, asyncWraper(forgotPasswordController));
authRouter.post("/resetpassword", authLimiter, asyncWraper(resetPasswordController));
authRouter.get("/me", authLimiter, authMiddleware(), asyncWraper(meController));

export default authRouter;
