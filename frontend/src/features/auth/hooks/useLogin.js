// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing login action and clear error action from auth slice
import { login as loginAction, clearError } from "../state/authSlice";

// Custom hook for login functionality
export function useLogin() {

    // Getting dispatch function from redux
    const dispatch = useDispatch();

    // Getting loading and error state from auth slice
    const { loading, error } = useSelector((state) => state.auth);

    // Function to login user
    const login = async (email, password) => {

        // Dispatching login action
        const result = await dispatch(loginAction({ email, password }));

        // Returning the result
        return result;
    };

    // Function to clear auth error
    const clearAuthError = () => {

        // Dispatching clear error action
        dispatch(clearError());
    };

    // Returning hook values and functions
    return { login, loading, error, clearAuthError };
}
