"use client";

import AuthRoute from "../../features/auth/ui/jsx/AuthRoute";
import Signup from "../../features/auth/ui/jsx/Signup";

export default function SignupPage() {
    return (
        <AuthRoute>
            <Signup />
        </AuthRoute>
    );
}
