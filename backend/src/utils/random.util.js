// funcitons to generate the random strings
function generateOTP(length = 6) {

    // Smallest number possible for the given OTP length.
    const min = 10 ** (length - 1);

    // Largest number possible for the given OTP length.
    const max = (10 ** length) - 1;

    // Generates a random integer between min and max (inclusive).
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    // Returns the OTP as a string.
    return otp;
}

// function to generate random alphanumeric token
function generateRandomToken(length = 32) {

    // characters to use for the token
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // holding the token
    let token = "";

    // looping to build the token
    for (let i = 0; i < length; i++) {

        // picking a random index
        const index = Math.floor(Math.random() * chars.length);

        // appending the character
        token += chars[index];
    }

    return token;
}

export { generateOTP, generateRandomToken }
