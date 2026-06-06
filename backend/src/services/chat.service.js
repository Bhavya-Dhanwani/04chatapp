// Importing modules
import chatModel from "../models/chat.model.js";
import userModel from "../models/user.model.js";
// Importing the message model so Mongoose registers the "messages" model before
// chat.service tries to populate "lastMessage" (which references it).
import "../models/message.model.js";
import ApiError from "../utils/ApiError.util.js";

// Service to fetch all chats for a given user, with participants and last message populated
async function getChatsService(userId) {

    // Querying chats where the user is a participant, newest activity first
    const chats = await chatModel
        .find({ participants: userId })
        .populate("participants", "name email profilePic isVerified")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

    return chats;
}

// Service to find an existing 1:1 chat between two users, or create a new one if none exists.
// Used by the "Make some friends" flow when a user picks someone to start chatting with.
async function accessOrCreateChatService(userId, otherUserId) {

    // Guard: cannot start a chat with yourself
    if (String(userId) === String(otherUserId)) {
        throw new ApiError(400, "You cannot start a chat with yourself");
    }

    // Guard: the target user must exist
    const otherUser = await userModel.findById(otherUserId);
    if (!otherUser) {
        throw new ApiError(404, "User not found");
    }

    // Looking for an existing 1:1 chat containing both users and exactly two participants
    let chat = await chatModel.findOne({
        participants: { $all: [userId, otherUserId], $size: 2 }
    });

    // No existing chat - create a new one with the two participants
    if (!chat) {
        chat = await chatModel.create({ participants: [userId, otherUserId] });
    }

    // Re-fetch with participants and last message populated so the client gets a fully shaped chat
    chat = await chatModel
        .findById(chat._id)
        .populate("participants", "name email profilePic isVerified")
        .populate("lastMessage");

    return chat;
}

export { getChatsService, accessOrCreateChatService };
