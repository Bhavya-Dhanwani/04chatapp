import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../app/api";
import { setUser, clearUser } from "../state/authSlice";

export function useMe() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        let cancelled = false;

        const fetchUser = async () => {
            try {
                const { data } = await api.get("/auth/me");
                if (!cancelled) {
                    dispatch(setUser(data.data));
                }
            } catch (err) {
                if (!cancelled) {
                    dispatch(clearUser());
                }
            }
        };

        if (!user) {
            fetchUser();
        }

        return () => {
            cancelled = true;
        };
    }, [dispatch, user]);

    return { user, loading };
}
