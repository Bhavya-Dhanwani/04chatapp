// Importing modules
import chatModel from "../models/chat.model.js";

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

export { getChatsService };
