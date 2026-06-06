// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing signup action and clear error action from auth slice
import { signup as signupAction, clearError } from "../state/authSlice";

// Custom hook for signup functionality
export function useSignup() {

    // Getting dispatch function from redux
    const dispatch = useDispatch();

    // Getting loading and error state from auth slice
    const { loading, error } = useSelector((state) => state.auth);

    // Function to signup user
    const signup = async (name, email, password, profilePic) => {

        // Dispatching signup action
        const result = await dispatch(signupAction({ name, email, password, profilePic }));

        // Returning the result
        return result;
    };

    // Function to clear auth error
    const clearAuthError = () => {

        // Dispatching clear error action
        dispatch(clearError());
    };

    // Returning hook values and functions
    return { signup, loading, error, clearAuthError };
}
