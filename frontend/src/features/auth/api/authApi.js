import api from "../../../app/api";

export const authApi = {
    login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        return data;
    },

    signup: async (name, email, password) => {
        const { data } = await api.post("/auth/signup", { name, email, password });
        return data;
    },

    verify: async (otp) => {
        const { data } = await api.post("/auth/verify", { otp });
        return data;
    },

    resendOtp: async () => {
        const { data } = await api.post("/auth/resendOtp");
        return data;
    },

    forgotPassword: async (email) => {
        const { data } = await api.post("/auth/forgotpassword", { email });
        return data;
    },

    resetPassword: async (token, newPassword) => {
        const { data } = await api.post("/auth/resetpassword", { token, newPassword });
        return data;
    },
};
