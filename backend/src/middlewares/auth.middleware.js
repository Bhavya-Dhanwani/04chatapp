// Importing modules
import ApiError from "../utils/ApiError.util.js";
import checkForToken from "../utils/checkFortoken.util.js";

// function for the middleware 
function authMiddleware(skipVerify = false) {

    // returning a function to get user input 
    return (req, res, next) => {
        // if user unauthorized then return
        const response = checkForToken(req);

        if (!response) throw new ApiError(401, "User unauthorized");

        // If skipVerify is not "no", check isVerified from token
        if (!skipVerify) {
            if (!req.user.isVerified) throw new ApiError(403, "User is not verified");
        }

        next();
    }
}


export default authMiddleware;