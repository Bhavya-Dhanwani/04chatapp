// Importing modules
import { loginService, signupService, updateVerified } from "../services/auth.service.js";
import { createSessionService, deleteAllSessions, deleteSessionService } from "../services/session.service.js";
import { checkOtp, deleteOtp, getOtp } from "../services/tokens.service.js";
import Apiresponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import { sanitizeUser } from "../utils/sanitize.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util.js";

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

export { signupController, loginController, logoutController, logoutAllController, otpCheckController, resendOtpController };
