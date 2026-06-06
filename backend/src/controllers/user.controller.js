// Importing modules
import { changePasswordService, changeProfilePicService, getRandomUsersService, searchUsersService } from "../services/user.service.js";
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

// Controller: GET /api/users/random  - return a random sample of verified users (excluding the requester)
async function getRandomUsersController(req, res) {

    // Reading the optional limit from the query string
    const { limit } = req.query;

    // Fetching the sample via the service
    const users = await getRandomUsersService(req.user.id, limit);

    return Apiresponse(res, 200, "Random users fetched successfully", users);
}

// Controller: GET /api/users/search?q=query  - search users by name
async function searchUsersController(req, res) {

    const { q, limit } = req.query;

    const users = await searchUsersService(req.user.id, q, limit);

    return Apiresponse(res, 200, "Users fetched successfully", users);
}

export { changePasswordController, changeProfilePicController, getRandomUsersController, searchUsersController };
