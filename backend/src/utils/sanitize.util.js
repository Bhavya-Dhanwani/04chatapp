// Function to sanitize the user and to send the data in a custom way
function sanitizeUser({ name, email, _id}, accesstoken) {
    return {
        name,
        email,
        id: _id,
        accesstoken: accesstoken
    }
}

export { sanitizeUser };
