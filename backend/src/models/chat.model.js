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

        chatType: {
            type: String,
            enum: ["direct", "group"],
            default: "direct"
        },

        name: {
            type: String,
            trim: true,
            default: ""
        },

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

// Index the chats for searching optimization
chatSchema.index({ participants: 1 });
chatSchema.index({ chatType: 1, name: 1 });

const chatModel =  mongoose.model("chats", chatSchema);
export default chatModel;