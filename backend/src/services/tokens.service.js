// Importing modules
import { generateOTP, generateRandomToken } from "../utils/random.util.js";
import otpModel from "../models/otp.model.js";
import resetTokenModel from "../models/resetToken.model.js";
import ApiError from "../utils/ApiError.util.js";

// funciton to generate and set otps
async function getOtp(userId, sessionId) {

    // generating the otp
    let otp = generateOTP();

    // Setting the otp in the db
    const otpSet = await otpModel.create({
        userId, sessionId, otp
    });

    return otpSet;

}

// function to check the otp from db
async function checkOtp(userId, sessionId, otp) {

    // finding the otp matching userId, sessionId and otp
    const otpFound = await otpModel.findOneAndDelete({
        userId, sessionId, otp
    });

    // checking if otp exists
    if (!otpFound) throw new ApiError(400, "Invalid or expired OTP");

    return true;

}

// function to delete old otps for a session
async function deleteOtp(userId, sessionId) {

    // deleting old otps matching userId and sessionId
    await otpModel.deleteMany({ userId, sessionId });

    return true;

}

// function to create reset token
async function createResetToken(userId) {

    // generating a random token
    const token = generateRandomToken();

    // deleting old reset tokens for the user
    await resetTokenModel.deleteMany({ userId });

    // saving the token in db
    const resetToken = await resetTokenModel.create({
        userId, token
    });

    return resetToken;

}

export { getOtp, checkOtp, deleteOtp, createResetToken };
