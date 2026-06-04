// Importing modules
import { loginService, signupService } from "../services/auth.service.js";
import { createSessionService, deleteSessionService } from "../services/session.service.js";
import Apiresponse from "../utils/ApiResponse.util.js";
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
    let { refreshToken, sessionId } = req.userPayload;

    // giving data to the delete service to delete the token from DB
    await deleteSessionService(refreshToken, sessionId);

    return Apiresponse(res, 204, "User deleted Successfully");
}

export { signupController, loginController };
