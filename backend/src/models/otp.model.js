// Importing modules 
import mongoose from "mongoose";

// making the schema for otps
const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users"
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sessions",
            required: true
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + (10 * 60 * 1000)),
            expires: 0
        }
    }
);

// making the model 
const otpModel = mongoose.model("otps", otpSchema);
export default otpModel;
