// Variable to store access token
let accessToken = "";

// Function to get access token
export const getAccessToken = () => accessToken;

// Function to set access token
export const setAccessToken = (token) => {
    accessToken = token;
};

// Function to clear access token
export const clearAccessToken = () => {
    accessToken = "";
};
