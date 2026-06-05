// Importing modules
import { generateOTP } from "../utils/random.util.js";
import otpModel from "../models/otp.model.js";
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

export { getOtp, checkOtp };
