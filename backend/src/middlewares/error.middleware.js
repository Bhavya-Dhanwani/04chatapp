// making the error mddlewares to hadnle the functions
function errorMiddleware(err, req, res, next) {

    // Configuring the data to be sent
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Sending the response
    res.status(statusCode).json({
        success: false,
        message
    });
}

export default errorMiddleware;
