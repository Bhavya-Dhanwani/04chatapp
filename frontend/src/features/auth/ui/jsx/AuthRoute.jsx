"use client";

// Importing useRouter hook from next/navigation
import { useRouter } from "next/navigation";

// Importing useEffect hook from react
import { useEffect } from "react";

// Importing useSelector hook from react-redux
import { useSelector } from "react-redux";

// Importing useMe hook to fetch current user
import { useMe } from "../../hooks/useMe";

// Component to protect auth routes (login, signup)
// Redirects authenticated users to home or verify page
export default function AuthRoute({ children }) {

    // Getting router instance for navigation
    const router = useRouter();

    // Fetching current user data
    const { user, loading } = useMe({ skipAuthRedirect: true });

    // Getting user from redux state
    const { user: reduxUser } = useSelector((state) => state.auth);

    // Combining user from both sources
    const currentUser = user || reduxUser;

    // Checking if user is logged in
    const isLoggedIn = !!currentUser;

    // Checking if user is verified
    const isVerified = currentUser?.isVerified;

    // Effect to redirect authenticated users
    useEffect(() => {

        // Don't redirect while loading
        if (!loading && isLoggedIn) {

            // Redirect to home if verified
            if (isVerified) {
                router.push("/");
            } else {

                // Redirect to verify if not verified
                router.push("/verify");
            }
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

    // Don't render children if user is logged in
    if (isLoggedIn) {
        return null;
    }

    // Render children if user is not logged in
    return children;
}
