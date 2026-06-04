import ApiError from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";
import { REFRESH_SECRET } from "../config/env.config.js";

// Function to get the data from the refresh token
function getRefresh(req, res, next) {

    // getting the refresh token 
    let token = req.cookies.chat_refresh_token;

    // validating the token
    if (token == undefined) throw new ApiError(401, "User unauthorized");
    if (typeof token != "string") throw new ApiError(401, "User unauthorized");

    // adding the try cathc coz verify will throw err if not verified 
    try {

        // Verifying the jwt signature 
        const payload = jwt.verify(token, REFRESH_SECRET);

        // setting the refreshtoken in the req
        req.userPayload = payload;
    } catch (err) {

        // Throw err 401 if signature not verified
        throw new ApiError(401, "User unauthorized");
    }

    // going to the controller
    next();
}

export default getRefresh;
