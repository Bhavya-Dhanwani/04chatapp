import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.util.js";
import { loginValidator, signupValidator } from "../validators/auth.validate.js";

// signup service to create users
async function signupService(name, email, password) {

    // Validating the data
    signupValidator(name, email, password);

    // added the user in the database
    const newuser = await userModel.create({ name, email, password });

    return newuser;
}

async function loginService(email, password) {

    // Validating the data received
    loginValidator(email, password);

    // finding the user 
    const newuser = await userModel.findOne({ email });

    // retuning is the user is not found
    if (!newuser) throw new ApiError(404, "User not found. Please signup first");

    // Checking for the passowords
    if (newuser.comparePasswords(password)) throw new ApiError(401, "Invalid email or password");

    return newuser;
}

// service to update user isVerified
async function updateVerified(userId) {

    // updating the user isVerified to true
    await userModel.findByIdAndUpdate(userId, { isVerified: true });

    return true;
}

export { signupService, loginService, updateVerified };
