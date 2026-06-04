// Importing modules
import { loginService, signupService } from "../services/auth.service.js";
import Apiresponse from "../utils/ApiResponse.util.js";
import { sanitizeUser } from "../utils/sanitize.util.js";

// Function to make the signup functionality
async function signupController(req, res) {

    // accepting the data
    let { name, email, password } = req.body;

    // Using the signup service to valdiate and create the user
    const newuser = await signupService(name, email, password);

    // geenrating the tokens
    const refreshtoken = newuser.generateRefreshToken();
    const accesstoken = newuser.generateAccessToken();

    // Setting the refresh token as cookie
    res.cookies("chat_refresh_token", refreshtoken, {
        httpOnly: true,
        secure: true,
        path: "/api/auth/refresh"
    });

    // Sending the res with accesstoken to get the accesstoken back as bearer authorizaiton
    return Apiresponse(res, 201, "User created successfully", sanitizeUser(newuser, accesstoken));

}

// function to make the login functionality
async function loginController(req, res) {

    // accepting the data
    let { email, password } = req.body;

    // Using the login service to validate the user and make him login
    const newuser = await loginService(email, password);

    // geenrating the tokens
    const refreshtoken = newuser.generateRefreshToken();
    const accesstoken = newuser.generateAccessToken();

    // Setting the refresh token as cookie
    res.cookies("chat_refresh_token", refreshtoken, {
        httpOnly: true,
        secure: true,
        path: "/api/auth/refresh"
    });

    // Sending the res with accesstoken to get the accesstoken back as bearer authorizaiton
    return Apiresponse(res, 200, "User Logged in Successfully", sanitizeUser(newuser, accesstoken));

}

export { signupController, loginController };
