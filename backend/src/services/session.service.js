// Importing the modules 
import mongoose from "mongoose";
import sessionModel from "../models/session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util.js";
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

async function deleteSessionService(refreshToken, sessionId, userId) {

    // Finding similar session and deleting
    const deleted = await sessionModel.findOneAndDelete({
        _id: sessionId,
        refreshToken,
        userId
    });

    // Checking if the session is delted?
    if (!deleted) {
        throw new ApiError(401, "Invalid session or refresh token");
    }

    return true;
}

async function deleteAllSessions(userId) {

    // Finding and delteing the sessions
    const deleted = await sessionModel.deleteMany({
        userId
    });

    if (deleted.deletedCount == 0) throw new ApiError(404, "No sessions found");

    return true
}


async function refreshService(refreshToken, sessionId, userId) {

    // finding the session 
    const session = await sessionModel.findOne({
        refreshToken,
        userId,
        _id: sessionId
    }).populate("userId");

    // Checking if we got the server or not
    if (!session) throw new ApiError(401, "Unauthorized user");

    // generating new tokens
    let newaccessToken = generateAccessToken(session.userId);
    let newRefreshToken = generateRefreshToken(session.userId._id, session._id);

    // setting new refresh token
    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days

    // saving the updated data
    await session.save();

    return { newaccessToken, newRefreshToken };

}

export { createSessionService, deleteSessionService, deleteAllSessions, refreshService };
