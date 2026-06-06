// Importing the axios api instance with interceptors
import api from "../../../app/api";

// Chat API object containing all chat-related API calls
export const chatApi = {

    // Function to fetch the authenticated user's chat list
    getChats: async () => {

        // Sending get request to backend
        const { data } = await api.get("/chats");

        // Returning the response data
        return data;
    },

    // Function to find an existing 1:1 chat with another user, or create a new one if none exists
    accessOrCreateChat: async (userId) => {

        // Sending post request to backend with the target user id
        const { data } = await api.post("/chats", { userId });

        // Returning the response data
        return data;
    },

    // Function to fetch messages for a chat (with optional cursor pagination)
    getMessages: async (chatId, { limit = 50, before } = {}) => {

        // Building query params
        const params = new URLSearchParams();
        if (limit) params.set("limit", String(limit));
        if (before) params.set("before", before);

        const qs = params.toString();
        const url = `/chats/${chatId}/messages${qs ? `?${qs}` : ""}`;

        // Sending get request to backend
        const { data } = await api.get(url);

        // Returning the response data
        return data;
    },

    // Function to send a message in a chat
    sendMessage: async (chatId, content) => {

        // Sending post request to backend with message content
        const { data } = await api.post(`/chats/${chatId}/messages`, { content });

        // Returning the response data
        return data;
    },
};
