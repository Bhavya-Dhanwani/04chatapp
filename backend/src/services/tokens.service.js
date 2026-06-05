// Importing modules
import { generateOTP } from "../utils/random.util.js";
import otpModel from "../models/otp.model.js";

// funciton to generate and set otps
async function getOtp(userId, sessionId) {

    // generating the otp
    let otp = generateOTP();

    // Setting the otp in the db
    const otpSet = await otpMode.createl({
        userId, sessionId, otp
    });

    return otpSet;

}

export { getOtp };
