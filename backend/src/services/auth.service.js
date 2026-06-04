import userModel from "../models/user.model.js";
import { signupValidator } from "../validators/auth.validate.js";

// signup service to create users
async function signupService(name, email, password) {

    // Validating the data
    signupValidator(name, email, password);

    // added the user in the database
    const newuser = await userModel.create({ name, email, password });

    return newuser;
}

export { signupService };
