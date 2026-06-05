// Importing useEffect hook from react
import { useEffect } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing api instance for making requests
import api from "../../../app/api";

// Importing setUser and clearUser actions from auth slice
import { setUser, clearUser } from "../state/authSlice";

// Custom hook to fetch and manage current user data
export function useMe() {

    // Getting dispatch function from redux
    const dispatch = useDispatch();

    // Getting user and loading state from auth slice
    const { user, loading } = useSelector((state) => state.auth);

    // Effect to fetch user data on mount
    useEffect(() => {

        // Flag to prevent state updates after component unmount
        let cancelled = false;

        // Async function to fetch user data
        const fetchUser = async () => {
            try {

                // Making GET request to /auth/me endpoint
                const { data } = await api.get("/auth/me");

                // Updating user state if not cancelled
                if (!cancelled) {
                    dispatch(setUser(data.data));
                }
            } catch (err) {

                // Clearing user state on error if not cancelled
                if (!cancelled) {
                    dispatch(clearUser());
                }
            }
        };

        // Fetching user only if not already loaded
        if (!user) {
            fetchUser();
        }

        // Cleanup function to prevent state updates after unmount
        return () => {
            cancelled = true;
        };
    }, [dispatch, user]);

    // Returning user and loading state
    return { user, loading };
}
