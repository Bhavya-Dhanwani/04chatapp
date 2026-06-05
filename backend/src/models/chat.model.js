import mongoose from "mongoose";

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

chatSchema.index({ participants: 1 });

export default mongoose.model("chats", chatSchema);