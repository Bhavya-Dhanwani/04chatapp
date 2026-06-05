// Importing modules
import mongoose from "mongoose";

// Making the chat schema to save chats
const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true
            }
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Index the chats for searchin optimization
chatSchema.index({ participants: 1 });

const chatModel =  mongoose.model("chats", chatSchema);
export default chatModel;