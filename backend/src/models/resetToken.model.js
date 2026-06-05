// Importing modules
import mongoose from "mongoose";

// making the schema for reset tokens
const resetTokenSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users"
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + (15 * 60 * 1000)),
            expires: 0
        }
    }
);

// making the model
const resetTokenModel = mongoose.model("resetTokens", resetTokenSchema);
export default resetTokenModel;
