// Importing the axios api instance with interceptors
import api from "../../../app/api";

// User API object containing all user-related API calls
export const userApi = {

    // Function to change the current user's password
    changePassword: async (currentPassword, newPassword) => {

        // Sending change-password request to backend
        const { data } = await api.patch("/users/me/password", { currentPassword, newPassword });

        // Returning the response data
        return data;
    },

    // Function to change the current user's profile picture URL (and ImageKit fileId, if known)
    changeProfilePic: async (profilePic, profilePicId) => {

        // Sending change-profile-pic request to backend
        const { data } = await api.patch("/users/me/profile-pic", { profilePic, profilePicId });

        // Returning the response data
        return data;
    },
};
