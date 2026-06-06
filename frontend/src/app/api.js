// Importing axios for HTTP requests
import axios from "axios";

// Importing token management utilities
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";

// Creating axios instance with default configuration
const api = axios.create({
    baseURL: "https://zero4chatapp.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor to add authorization header
api.interceptors.request.use(
    (config) => {

        // Getting access token from storage
        const token = getAccessToken();

        // Adding authorization header if token exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Ensuring credentials are sent with every request
        config.withCredentials = true;

        // Returning modified config
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        // Getting original request config
        const originalRequest = error.config;

        // Checking if error is 401 or 403 and request hasn't been retried
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {

            // Marking request as retried
            originalRequest._retry = true;

            try {

                // Attempting to refresh token
                const { data } = await axios.post(
                    "http://localhost:5000/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                // Getting new token from response
                const newToken = data?.data;

                // If new token exists, update and retry request
                if (newToken) {
                    setAccessToken(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {

                // Logging refresh error for debugging
                console.log("Token refresh error:", refreshError);

                // Refresh failed — clear token and redirect to login
                clearAccessToken();
                if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                    window.location.href = "/login";
                }
            }
        }

        // Logging API error for debugging
        console.log("API error:", error);

        // Rejecting the error
        return Promise.reject(error);
    }
);

// Exporting api instance
export default api;
