"use client";

// Importing useRouter hook from next/navigation
import { useRouter } from "next/navigation";

// Importing useEffect hook from react
import { useEffect } from "react";

// Importing useSelector hook from react-redux
import { useSelector } from "react-redux";

// Importing useMe hook to fetch current user
import { useMe } from "../../hooks/useMe";

// Component to protect routes that require authentication
// Redirects unauthenticated users to login and unverified users to verify
export default function ProtectedRoute({ children }) {

    // Getting router instance for navigation
    const router = useRouter();

    // Fetching current user data
    const { user, loading } = useMe();

    // Getting user from redux state
    const { user: reduxUser } = useSelector((state) => state.auth);

    // Combining user from both sources
    const currentUser = user || reduxUser;

    // Checking if user is logged in
    const isLoggedIn = !!currentUser;

    // Checking if user is verified
    const isVerified = currentUser?.isVerified;

    // Effect to redirect based on auth status
    useEffect(() => {

        // Don't redirect while loading
        if (loading) return;

        // Redirect to login if not authenticated
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        // Redirect to verify if not verified
        if (!isVerified) {
            router.push("/verify");
            return;
        }
    }, [loading, isLoggedIn, isVerified, router]);

    // Showing loading state
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000" }}>
                <p style={{ color: "#8e8e8e", fontSize: "14px" }}>Loading...</p>
            </div>
        );
    }

    // Don't render children if not authenticated or not verified
    if (!isLoggedIn || !isVerified) {
        return null;
    }

    // Render children if user is authenticated and verified
    return children;
}
