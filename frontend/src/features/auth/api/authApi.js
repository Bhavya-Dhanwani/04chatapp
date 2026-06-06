// Importing the axios api instance with interceptors
import api from "../../../app/api";

// Auth API object containing all authentication-related API calls
export const authApi = {

    // Function to login user with email and password
    login: async (email, password) => {

        // Sending login request to backend
        const { data } = await api.post("/auth/login", { email, password });

        // Returning the response data
        return data;
    },

    // Function to register new user with name, email, password and optional profile picture URL + ImageKit fileId
    signup: async (name, email, password, profilePic, profilePicId) => {

        // Sending signup request to backend
        const { data } = await api.post("/auth/signup", { name, email, password, profilePic, profilePicId });

        // Returning the response data
        return data;
    },

    // Function to verify user account with OTP
    verify: async (otp) => {

        // Sending verification request to backend
        const { data } = await api.post("/auth/verify", { otp });

        // Returning the response data
        return data;
    },

    // Function to resend OTP to user's email
    resendOtp: async () => {

        // Sending resend OTP request to backend
        const { data } = await api.post("/auth/resendOtp");

        // Returning the response data
        return data;
    },

    // Function to request password reset email
    forgotPassword: async (email) => {

        // Sending forgot password request to backend
        const { data } = await api.post("/auth/forgotpassword", { email });

        // Returning the response data
        return data;
    },

    // Function to reset password using token
    resetPassword: async (token, newPassword) => {

        // Sending reset password request to backend
        const { data } = await api.post("/auth/resetpassword", { token, newPassword });

        // Returning the response data
        return data;
    },
};
