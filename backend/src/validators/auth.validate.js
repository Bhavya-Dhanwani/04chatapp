import ApiError from "../utils/ApiError.util.js";

// Function to validate the signup data
function signupValidator(name, email, password, profilePic, profilePicId) {

    // Applying the validations
    if (!name) throw new ApiError(400, "Name is required");

    if (!email) throw new ApiError(400, "Email is required");

    if (!password) throw new ApiError(400, "Password is required");

    if (name.trim().length < 3) throw new ApiError(400, "Name must include alteast 3 charaters with are not spaces");

    // Checking the email with the regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) throw new ApiError(400, "Please enter a valid eamail");

    // profilePic is optional, but if provided must be a valid http(s) url
    if (profilePic !== undefined && profilePic !== null && profilePic !== "") {
        if (typeof profilePic !== "string") throw new ApiError(400, "Profile picture must be a valid URL");
        const urlRegex = /^https?:\/\/[^\s]+$/;
        if (!urlRegex.test(profilePic)) throw new ApiError(400, "Profile picture must be a valid URL");
    }

    // profilePicId is optional; if provided, must be a non-empty string
    if (profilePicId !== undefined && profilePicId !== null && profilePicId !== "") {
        if (typeof profilePicId !== "string") throw new ApiError(400, "Profile picture id must be a string");
    }
}

function loginValidator(email, password) {

    // Applying the validations
    if (!email) throw new ApiError(400, "Email is required");

    if (!password) throw new ApiError(400, "Password is required");

    // Checking the email with the regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) throw new ApiError(400, "Please enter a valid eamail");
}

export { signupValidator, loginValidator };
