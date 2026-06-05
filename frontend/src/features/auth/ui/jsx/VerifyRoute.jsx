"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMe } from "../../hooks/useMe";

export default function VerifyRoute({ children }) {
    const router = useRouter();
    const { user, loading } = useMe();
    const { user: reduxUser } = useSelector((state) => state.auth);

    const currentUser = user || reduxUser;
    const isLoggedIn = !!currentUser;
    const isVerified = currentUser?.isVerified;

    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        if (isVerified) {
            router.push("/");
            return;
        }
    }, [loading, isLoggedIn, isVerified, router]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000" }}>
                <p style={{ color: "#8e8e8e", fontSize: "14px" }}>Loading...</p>
            </div>
        );
    }

    if (!isLoggedIn || isVerified) {
        return null;
    }

    return children;
}
