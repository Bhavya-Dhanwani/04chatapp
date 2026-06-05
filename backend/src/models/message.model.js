// Importing the moduels
import mongoose from "mongoose";

// Making the message schema to store messages
const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chats",
            required: true
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent"
        }
    },
    {
        timestamps: true
    }
);

// Indeing using chat id to get the messages faster
messageSchema.index({
    chatId: 1,
    createdAt: -1
});

// Making the model of the message
const messageMoedl = mongoose.model("messages", messageSchema);
export default messageMoedl;