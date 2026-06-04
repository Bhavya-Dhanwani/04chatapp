// Importing the modules 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { REFRESH_SECRET } from "../config/env.config";
import { ACCESS_SECRET } from "../config/env.config";

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
            require: true,
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

// Adding the post methods to add the 
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, REFRESH_SECRET, {
        expiresIn: "7d"
    });
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, email: this.email, name: this.name }, ACCESS_SECRET, {
        expiresIn: "30m"
    });
}

// Making the model
const useModel = await new mongoose.model("users", userSchema);
