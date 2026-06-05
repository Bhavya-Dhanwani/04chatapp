import mongoose from "mongoose";

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

messageSchema.index({
    chatId: 1,
    createdAt: -1
});

export default mongoose.model("messages", messageSchema);