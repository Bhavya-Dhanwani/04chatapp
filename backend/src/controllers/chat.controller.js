// Importing modules
import Apiresponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import { getChatsService, accessOrCreateChatService } from "../services/chat.service.js";

// Controller to return the authenticated user's chat list
async function getChatsController(req, res) {

    // Reading the authenticated user id from the access token payload
    const userId = req.user.id;

    // Fetching the chats for this user
    const chats = await getChatsService(userId);

    // Returning the chats (empty array when the user has no chats yet)
    return Apiresponse(res, 200, "Chats fetched successfully", chats);
}

// Controller to access (or create) a 1:1 chat with another user by their id
async function accessOrCreateChatController(req, res) {

    // Reading the other user's id from the body
    const { userId: otherUserId } = req.body;

    // Guard: a target userId is required
    if (!otherUserId) {
        throw new ApiError(400, "userId is required");
    }

    // Finding or creating the chat
    const chat = await accessOrCreateChatService(req.user.id, otherUserId);

    return Apiresponse(res, 200, "Chat fetched successfully", chat);
}

export { getChatsController, accessOrCreateChatController };
