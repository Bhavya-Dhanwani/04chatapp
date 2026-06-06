// Importing modules
import chatModel from "../models/chat.model.js";
import userModel from "../models/user.model.js";
// Importing the message model so Mongoose registers the "messages" model before
// chat.service tries to populate "lastMessage" (which references it).
import "../models/message.model.js";
import ApiError from "../utils/ApiError.util.js";

// Global chat constants
const GLOBAL_CHAT_NAME = "Global";
const GLOBAL_CHAT_TYPE = "group";

// Service to fetch all chats for a given user, with participants and last message populated
async function getChatsService(userId) {

    // Ensure the user is in the global chat before fetching (best-effort, don't crash if it fails)
    try {
        await addToGlobalChat(userId);
    } catch {
        // If global chat setup fails, still return the user's chats
    }

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

// Service to ensure the global group chat exists (creates it if missing)
async function ensureGlobalChatExists() {
    let globalChat = await chatModel.findOne({
        chatType: GLOBAL_CHAT_TYPE,
        name: GLOBAL_CHAT_NAME
    });

    if (!globalChat) {
        globalChat = await chatModel.create({
            participants: [],
            chatType: GLOBAL_CHAT_TYPE,
            name: GLOBAL_CHAT_NAME
        });
    }

    return globalChat;
}

// Service to add a user to the global group chat
async function addToGlobalChat(userId) {
    const globalChat = await ensureGlobalChatExists();

    // Only add if user is not already a participant (compare as strings)
    const alreadyIn = globalChat.participants.some((p) => String(p) === String(userId));
    if (!alreadyIn) {
        globalChat.participants.push(userId);
        await globalChat.save();
    }

    return globalChat;
}

export { getChatsService, accessOrCreateChatService, ensureGlobalChatExists, addToGlobalChat };
