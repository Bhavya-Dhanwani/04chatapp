import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    "http://localhost:5000/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                const newToken = data?.data;
                if (newToken) {
                    setAccessToken(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // refresh failed, do nothing - user stays on current page
            }
        }

        return Promise.reject(error);
    }
);

export default api;
