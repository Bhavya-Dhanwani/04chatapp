// Importing the modules 
import mongoose from "mongoose";
import sessionModel from "../models/session.model.js";
import { generateRefreshToken } from "../utils/token.util.js";
import ApiError from "../utils/ApiError.util.js";

async function createSessionService(userId) {

    // generateing a objectid for mongoose
    let sessionId = new mongoose.Types.ObjectId();

    // generating a refresh token
    const refreshToken = generateRefreshToken(userId, sessionId);

    // creating a session
    const session = await sessionModel.create({
        _id: sessionId,
        refreshToken,
        userId,
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    });

    return { session, refreshToken };

}

async function deleteSessionService(refreshToken, sessionId) {

    // Finding similar session and deleting
    const deleted = await sessionModel.findOneAndDelete({
        _id: sessionId,
        refreshToken
    });

    // Checking if the session is delted?
    if (!deleted) {
        throw new ApiError(401, "Invalid session or refresh token");
    }

    return true;
}

export { createSessionService, deleteSessionService };
