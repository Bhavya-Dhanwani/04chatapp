"use client";

import AuthRoute from "../../features/auth/ui/jsx/AuthRoute";
import Login from "../../features/auth/ui/jsx/Login";

export default function LoginPage() {
    return (
        <AuthRoute>
            <Login />
        </AuthRoute>
    );
}
