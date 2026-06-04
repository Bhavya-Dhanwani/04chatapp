// Importing modules
import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/env.config.js";

// Functtion to generate the access token
function generateAccessToken({ _id, name, email }) {

    // generating a returning the token
    return jwt.sign(
        {
            id: _id,
            name,
            email
        },
        ACCESS_SECRET,
        {
            expiresIn: "30m"
        }
    );
}

function generateRefreshToken(userId, sessionId) {

    // generating and returning the token
    return jwt.sign(
        {
            userId,
            sessionId,
        },
        REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

export { generateAccessToken, generateRefreshToken };
