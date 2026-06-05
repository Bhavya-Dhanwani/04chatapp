import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, clearError } from "../state/authSlice";

export function useLogin() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const login = async (email, password) => {
        const result = await dispatch(loginAction({ email, password }));
        return result;
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    return { login, loading, error, clearAuthError };
}
