// Importing modules
import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/env.config.js";

// function made to check if token exists or not
function checkForToken(req) {


    // getting the access token
    let token = req.headers.authorization;

    // Checking if token exists 
    if (token == undefined) return false;

    // checking if token starts with the Bearer 
    if (!token.startsWith("Bearer ")) return false;

    // Checking if brearer have something more or not
    token = token.split(" ")[1];

    if (token == undefined || token.trim() == "") return false;

    // Checking the jwt with a try catch
    try {

        // varifying the signature on the token
        const payload = jwt.verify(token, ACCESS_SECRET);

        // if we find user then setting in the req
        req.user = payload;
    } catch (err) {
        return false;
    }

    return true;
}

export default checkForToken;
