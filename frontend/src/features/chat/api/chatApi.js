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
};
