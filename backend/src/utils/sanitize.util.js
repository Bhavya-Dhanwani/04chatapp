// Function to sanitize the user and to send the data in a custom way
function sanitizeUser(user, accesstoken) {

    // Extracting the user data safely
    const { name, email, profilePic, profilePicId } = user;

    // Getting the user id - handles both _id (from MongoDB) and id (from JWT)
    const userId = user._id || user.id;

    // Returning the sanitized user object
    return {
        name,
        email,
        id: userId,
        isVerified: user.isVerified,
        profilePic: profilePic || "",
        profilePicId: profilePicId || "",
        accesstoken: accesstoken || null
    }
}

export { sanitizeUser };
