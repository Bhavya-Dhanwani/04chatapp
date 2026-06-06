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
};
