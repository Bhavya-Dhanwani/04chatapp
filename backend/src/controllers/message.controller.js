// Importing modules
import Apiresponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import { sendMessageService, getMessagesService } from "../services/message.service.js";

// Controller to send a message in a chat
async function sendMessageController(req, res) {

    // Reading chat id from params and content from body
    const { chatId } = req.params;
    const { content } = req.body;

    // Guard: content is required
    if (!content) {
        throw new ApiError(400, "content is required");
    }

    // Sending the message
    const message = await sendMessageService(chatId, req.user.id, content);

    return Apiresponse(res, 201, "Message sent successfully", message);
}

// Controller to fetch messages for a chat
async function getMessagesController(req, res) {

    // Reading chat id from params and pagination options from query
    const { chatId } = req.params;
    const { limit, before } = req.query;

    // Fetching the messages
    const messages = await getMessagesService(chatId, req.user.id, { limit, before });

    return Apiresponse(res, 200, "Messages fetched successfully", messages);
}

export { sendMessageController, getMessagesController };
