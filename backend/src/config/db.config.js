// Importing modules
import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";

// Funciton to connect the DB
async function connectDB() {

    // Connect the DB in the try cathc block to detect the errors 
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Mongo DB Connected");
    } catch (err) {
        console.log("Error connecting the DATABASE");
    }
}

export default connectDB;
