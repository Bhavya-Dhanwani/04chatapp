// Importing modules
import ApiError from "../utils/ApiError.util.js";
import checkForToken from "../utils/checkFortoken.util.js";

// function for the middleware 
async function authMiddleware(req, res, next) {

    // if user unauthorized then return
    const response = checkForToken(req);

    if(!response) throw new ApiError(401, "User unauthorized");
    
    next();
}
