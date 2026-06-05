import api from "../../../shared/api";

export const authApi = {
    login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        return data;
    },

    signup: async (name, email, password) => {
        const { data } = await api.post("/auth/signup", { name, email, password });
        return data;
    },
};
