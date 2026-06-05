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

export { generateOTP }
