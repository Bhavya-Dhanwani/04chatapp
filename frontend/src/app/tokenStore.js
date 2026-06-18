const STORAGE_KEY = "access_token";

// Function to get access token
export const getAccessToken = () => {
    if (typeof window === "undefined") return "";
    try {
        return localStorage.getItem(STORAGE_KEY) || "";
    } catch (error) {
        console.error("localStorage get error:", error);
        return "";
    }
};

// Function to set access token
export const setAccessToken = (token) => {
    if (typeof window === "undefined") return;
    try {
        if (token) {
            localStorage.setItem(STORAGE_KEY, token);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (error) {
        console.error("localStorage set error:", error);
    }
};

// Function to clear access token
export const clearAccessToken = () => {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("localStorage remove error:", error);
    }
};
