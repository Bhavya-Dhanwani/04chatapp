// Importing the modules 
import mongoose from "mongoose";
import sessionModel from "../models/session.model.js";
import { generateRefreshToken } from "../utils/token.util.js";

async function createSessionService(userId) {

    // generateing a objectid for mongoose
    let sessionId = new mongoose.Types.ObjectId();

    // generating a refresh token
    const refresToken = generateRefreshToken(userId, sessionId);

    // creating a session
    const session = await sessionModel.create({
        _id: sessionId,
        refreshToken,
        userId,
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    });

    return { session, refresToken };

}

export { createSessionService };
