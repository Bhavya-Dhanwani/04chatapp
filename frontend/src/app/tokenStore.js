const STORAGE_KEY = "access_token";

// Function to get access token
export const getAccessToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
};

// Function to set access token
export const setAccessToken = (token) => {
    if (typeof window === "undefined") return;
    if (token) {
        localStorage.setItem(STORAGE_KEY, token);
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
};

// Function to clear access token
export const clearAccessToken = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
};
