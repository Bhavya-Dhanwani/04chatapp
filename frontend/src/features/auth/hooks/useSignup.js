import { useDispatch, useSelector } from "react-redux";
import { signup as signupAction, clearError } from "../state/authSlice";

export function useSignup() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const signup = async (name, email, password) => {
        const result = await dispatch(signupAction({ name, email, password }));
        return result;
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    return { signup, loading, error, clearAuthError };
}
