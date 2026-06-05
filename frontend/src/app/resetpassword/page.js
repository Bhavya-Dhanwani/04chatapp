"use client";

import { Suspense } from "react";
import ResetPassword from "../../features/auth/ui/jsx/ResetPassword";

function ResetPasswordContent() {
    return <ResetPassword />;
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000" }}>
                <p style={{ color: "#8e8e8e", fontSize: "14px" }}>Loading...</p>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
