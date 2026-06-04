// Inherited the error class of js to apply customization
class ApiError extends Error {
    constructor(statusCode, message) {

        // Applied super to message to inherit the properties
        super(message);

        // Setting the values inside the error object
        this.statusCode = statusCode;
        this.message = message;
    }
}

export default ApiError;
