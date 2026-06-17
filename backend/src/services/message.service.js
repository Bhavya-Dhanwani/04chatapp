// Importing modules
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";
import ApiError from "../utils/ApiError.util.js";
import { getIO } from "../sockets/socket.server.js";

// Service to send a message in a chat
async function sendMessageService(chatId, senderId, content) {

    // Guard: content must not be empty
    if (!content || !content.trim()) {
        throw new ApiError(400, "Message content is required");
    }

    // Guard: chat must exist
    const chat = await chatModel.findById(chatId);
    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // Guard: sender must be a participant of the chat
    if (!chat.participants.some((p) => String(p) === String(senderId))) {
        throw new ApiError(403, "You are not a participant of this chat");
    }

    // Creating the message
    const message = await messageModel.create({
        chatId,
        senderId,
        content: content.trim()
    });

    // Updating the chat's lastMessage and touching updatedAt
    chat.lastMessage = message._id;
    await chat.save();

    // Re-fetching with sender populated so the client gets the full shape
    const populated = await messageModel
        .findById(message._id)
        .populate("senderId", "name profilePic");

    const populatedChat = await chatModel
        .findById(chat._id)
        .populate("participants", "name email profilePic isVerified")
        .populate("lastMessage");

    // Emitting to the chat room plus each participant's personal room.
    // A recipient may not have joined a brand-new direct chat room yet, so
    // personal rooms ensure the first message creates the chat row for them.
    const io = getIO();
    if (io) {
        const rooms = [String(chatId), ...chat.participants.map((p) => String(p))];
        io.to(rooms).emit("receive_message", {
            chatId,
            message: populated,
            chat: populatedChat
        });
    }

    return populated;
}

// Service to fetch messages for a chat (pagination via cursor)
async function getMessagesService(chatId, userId, { limit = 50, before } = {}) {

    // Guard: chat must exist
    const chat = await chatModel.findById(chatId);
    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // Guard: user must be a participant
    if (!chat.participants.some((p) => String(p) === String(userId))) {
        throw new ApiError(403, "You are not a participant of this chat");
    }

    // Building the query — optional cursor for infinite scroll
    const query = { chatId };
    if (before) {
        query.createdAt = { $lt: new Date(before) };
    }

    // Fetching messages newest-first, then reversing to show oldest-first in the UI
    const messages = await messageModel
        .find(query)
        .populate("senderId", "name profilePic")
        .sort({ createdAt: -1 })
        .limit(Math.min(Number(limit) || 50, 100))
        .lean();

    // Reversing so the UI renders oldest message at top
    return messages.reverse();
}

export { sendMessageService, getMessagesService };
