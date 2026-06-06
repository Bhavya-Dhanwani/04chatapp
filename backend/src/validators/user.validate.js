import ApiError from "../utils/ApiError.util.js";

// Validates the change-password payload
function changePasswordValidator(currentPassword, newPassword) {

    // Both fields are required
    if (!currentPassword) throw new ApiError(400, "Current password is required");

    if (!newPassword) throw new ApiError(400, "New password is required");

    // New password must be at least 6 characters (same rule as signup)
    if (typeof newPassword !== "string" || newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters");
    }

    // New password must differ from the current one
    if (currentPassword === newPassword) {
        throw new ApiError(400, "New password must be different from the current password");
    }
}

// Validates the change-profile-pic payload
function changeProfilePicValidator(profilePic, profilePicId) {

    // Field is required (cannot be empty / null)
    if (profilePic === undefined || profilePic === null || profilePic === "") {
        throw new ApiError(400, "Profile picture URL is required");
    }

    // Must be a string
    if (typeof profilePic !== "string") {
        throw new ApiError(400, "Profile picture must be a valid URL");
    }

    // Must be a valid http(s) URL
    const urlRegex = /^https?:\/\/[^\s]+$/;
    if (!urlRegex.test(profilePic)) {
        throw new ApiError(400, "Profile picture must be a valid URL");
    }

    // profilePicId is optional; if provided, must be a non-empty string
    if (profilePicId !== undefined && profilePicId !== null && profilePicId !== "") {
        if (typeof profilePicId !== "string") {
            throw new ApiError(400, "Profile picture id must be a string");
        }
    }
}

export { changePasswordValidator, changeProfilePicValidator };
