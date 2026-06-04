// Importing the Modules 
import mongoose, { mongo } from "mongoose";

// Making the session schema to maintain user sesisons accross different devices 
const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users",
            index: true,
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0
            }
        }
    },
    {
        timestamps: true
    }
);

// making a model to use the schema with db 
const sessionModel = mongoose.model("sessions", sessionSchema);
export default sessionModel;
