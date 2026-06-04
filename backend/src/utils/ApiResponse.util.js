// Function to return the response in a structured way
function Apiresponse(res, status, message, data = null) {

    // sending the response
    return res.status(status).json({
        success: true,
        message,
        data
    });

}

export default Apiresponse;
