// Importing modules
import { changePasswordService, changeProfilePicService } from "../services/user.service.js";
import Apiresponse from "../utils/ApiResponse.util.js";
import { sanitizeUser } from "../utils/sanitize.util.js";

// Controller: PATCH /api/users/me/password
async function changePasswordController(req, res) {

    // Reading the password fields from the body
    const { currentPassword, newPassword } = req.body;

    // Running the service for the current user (id from access token middleware)
    const updatedUser = await changePasswordService(req.user.id, currentPassword, newPassword);

    // Returning the updated, sanitized user
    return Apiresponse(res, 200, "Password changed successfully", sanitizeUser(updatedUser));
}

// Controller: PATCH /api/users/me/profile-pic
async function changeProfilePicController(req, res) {

    // Reading the new profile picture URL and ImageKit fileId
    const { profilePic, profilePicId } = req.body;

    // Running the service for the current user
    const updatedUser = await changeProfilePicService(req.user.id, profilePic, profilePicId);

    // Returning the updated, sanitized user
    return Apiresponse(res, 200, "Profile picture updated successfully", sanitizeUser(updatedUser));
}

export { changePasswordController, changeProfilePicController };
