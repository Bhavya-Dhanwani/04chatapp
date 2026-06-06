// Importing modules
import Apiresponse from "../utils/ApiResponse.util.js";
import { getChatsService } from "../services/chat.service.js";

// Controller to return the authenticated user's chat list
async function getChatsController(req, res) {

    // Reading the authenticated user id from the access token payload
    const userId = req.user.id;

    // Fetching the chats for this user
    const chats = await getChatsService(userId);

    // Returning the chats (empty array when the user has no chats yet)
    return Apiresponse(res, 200, "Chats fetched successfully", chats);
}

export { getChatsController };
