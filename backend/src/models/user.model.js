// Importing the modules 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Making the user Schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: [true, "Email already exists"]
        },
        password: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

// Adding the pre methods to hash passwords
userSchema.pre("save", function () {

    // Checking if the password is already hashed or not
    if (this.isModified("password")) return;

    // Hashing the password
    this.password = bcrypt.hashSync(this.password, 10);
});

// Added the post method to compare the passwords
userSchema.methods.comparePasswords = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// Making the model
const userModel = await new mongoose.model("users", userSchema);
export default userModel;
