// Function to handle the async functions
function asyncWraper(fn) {

    // Resolving a async function and returning it with a cathc block to handle the errors
    return (req, res, next)  => {
        Promise.resolve(fn(req, res, next)).catch(err => next(err));
    }

}

export default asyncWraper;
