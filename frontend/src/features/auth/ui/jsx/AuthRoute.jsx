"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMe } from "../../hooks/useMe";

export default function AuthRoute({ children }) {
    const router = useRouter();
    const { user, loading } = useMe();
    const { user: reduxUser } = useSelector((state) => state.auth);

    const isLoggedIn = user || reduxUser;

    useEffect(() => {
        if (!loading && isLoggedIn) {
            router.push("/");
        }
    }, [loading, isLoggedIn, router]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000" }}>
                <p style={{ color: "#8e8e8e", fontSize: "14px" }}>Loading...</p>
            </div>
        );
    }

    if (isLoggedIn) {
        return null;
    }

    return children;
}
