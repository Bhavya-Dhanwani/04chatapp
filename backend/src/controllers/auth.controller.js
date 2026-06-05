// Importing modules
import { loginService, resetPassword, signupService, updateVerified } from "../services/auth.service.js";
import { createSessionService, deleteAllSessions, deleteSessionService, refreshService } from "../services/session.service.js";
import { checkOtp, createResetToken, deleteOtp, getOtp, verifyResetToken } from "../services/tokens.service.js";
import Apiresponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import { sanitizeUser } from "../utils/sanitize.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util.js";
import sendMail from "../utils/sendMail.util.js";
import { FRONTEND_URL } from "../config/env.config.js";

// Function to make the signup functionality
async function signupController(req, res) {

    // accepting the data
    let { name, email, password } = req.body;

    // Using the signup service to valdiate and create the user
    const newuser = await signupService(name, email, password);

    // using sessions service to create session
    const { refreshToken, session } = createSessionService(newuser._id);

    // geenrating the access token
    const accesstoken = generateAccessToken(newuser);

    const otp = getOtp(newuser._id, session._id);

    sendMail(email, "Otp to for acc verficaiton", `<h1>${otp.otp}</h1>`);

    // Setting the refresh token as cookie
    res.cookie("chat_refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/api/auth"
    });

    // Sending the res with accesstoken to get the accesstoken back as bearer authorizaiton
    return Apiresponse(res, 201, "User created successfully", sanitizeUser(newuser, accesstoken));

}

// function to make the login functionality
async function loginController(req, res) {

    // accepting the data
    let { email, password } = req.body;

    // Using the signup service to valdiate and create the user
    const newuser = await loginService(email, password);

    // using sessions service to create session
    const { refreshToken, session } = createSessionService(newuser._id);

    // geenrating the access token
    const accesstoken = generateAccessToken(newuser);

    // Setting the refresh token as cookie
    res.cookie("chat_refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/api/auth"
    });


    // Sending the res with accesstoken to get the accesstoken back as bearer authorizaiton
    return Apiresponse(res, 200, "User Logged in Successfully", sanitizeUser(newuser, accesstoken));

}

async function logoutController(req, res) {

    // getting the data
    let { refreshToken, sessionId, userId } = req.userPayload;

    // giving data to the delete service to delete the token from DB
    await deleteSessionService(refreshToken, sessionId, userId);

    // retuning the response
    return Apiresponse(res, 204, "Session deleted Successfully");
}

async function logoutAllController(req, res) {

    // getting the data
    let { userId } = req.userPayload;

    // giving data to the service to delte the sessions running
    await deleteAllSessions(userId);

    return Apiresponse(res, 204, "Sessions deleted Successfully");
}

// function to verify the otp
async function otpCheckController(req, res) {

    // checking if user is already verified
    if (req.user.isVerified) throw new ApiError(400, "User is already verified");

    // getting the data from req
    let { userId, sessionId } = req.userPayload;
    let { otp } = req.body;

    // checking the otp from db
    await checkOtp(userId, sessionId, otp);

    // updating the user isVerified to true
    await updateVerified(userId);

    // returning the response
    return Apiresponse(res, 200, "User verified successfully");

}

// function to resend the otp
async function resendOtpController(req, res) {

    // checking if user is already verified
    if (req.user.isVerified) throw new ApiError(400, "User is already verified");

    // getting the data from req
    let { userId, sessionId } = req.userPayload;

    // deleting the old otp
    await deleteOtp(userId, sessionId);

    // generating a new otp
    const newOtp = await getOtp(userId, sessionId);

    // returning the response
    return Apiresponse(res, 200, "OTP resent successfully");

}

// function to send forgot password link
async function forgotPasswordController(req, res) {

    // getting the user id from req
    let { userId } = req.userPayload;

    // creating a reset token
    const resetToken = await createResetToken(userId);

    // making the magic link
    const resetLink = `${FRONTEND_URL}/reset/${resetToken.token}`;

    // sending the mail with the link
    await sendMail(req.user.email, "Reset your password", `<h1>Click here to reset your password</h1><a href="${resetLink}">${resetLink}</a>`);

    // returning the response
    return Apiresponse(res, 200, "Reset link sent to your email");

}

// function to reset password using token
async function resetPasswordController(req, res) {

    // getting the token from body
    let { token } = req.body;

    // getting the new password from body
    let { newPassword } = req.body;

    // verifying the reset token and getting the userId
    const tokenFound = await verifyResetToken(token);

    // resetting the password
    await resetPassword(tokenFound.userId, newPassword);

    // returning the response
    return Apiresponse(res, 200, "Password reset successfully");

}

async function refreshController(req, res) {

    // getting the data
    let { refreshToken, sessionId, userId } = req.userPayload;

    // using the refreshService to validate the tokens 
    let { newaccessToken, newRefreshToken } = await refreshService(refreshToken, sessionId, userId); 

    // Setting the refresh token as cookie
    res.cookie("chat_refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        path: "/api/auth"
    });

    // returnning the new access token
    return Apiresponse(res, 200, "Rotated token successfully", newaccessToken);

}

export {
    signupController,
    loginController,
    logoutController,
    logoutAllController,
    otpCheckController,
    resendOtpController,
    forgotPasswordController,
    resetPasswordController
};
