import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.util.js";
import { changePasswordValidator, changeProfilePicValidator } from "../validators/user.validate.js";
import imagekit from "../config/imagekit.config.js";

// Service to change the current user's password
async function changePasswordService(userId, currentPassword, newPassword) {

    // Validating inputs
    changePasswordValidator(currentPassword, newPassword);

    // Loading the user document
    const user = await userModel.findById(userId);

    // Guard: user must exist
    if (!user) throw new ApiError(404, "User not found");

    // Verifying the current password
    if (!user.comparePasswords(currentPassword)) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // Assigning the new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return user;
}

// Service to change the current user's profile picture URL
async function changeProfilePicService(userId, profilePic, profilePicId) {

    // Validating inputs
    changeProfilePicValidator(profilePic, profilePicId);

    // Loading the current user to capture the old fileId before we overwrite it
    const existing = await userModel.findById(userId);
    if (!existing) throw new ApiError(404, "User not found");

    // Best-effort delete of the previous file from ImageKit.
    // Failure here is non-fatal - we still want to save the new pic.
    const oldFileId = existing.profilePicId;
    if (oldFileId) {
        try {
            await imagekit.files.delete(oldFileId);
        } catch (err) {
            // Silently ignore failures to avoid blocking the update
        }
    }

    // Updating the profilePic + profilePicId and returning the fresh document
    const user = await userModel.findByIdAndUpdate(
        userId,
        { profilePic, profilePicId: profilePicId || "" },
        { returnDocument: "after", runValidators: true }
    );

    return user;
}

export { changePasswordService, changeProfilePicService };
