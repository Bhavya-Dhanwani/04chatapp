"use client";

import ProtectedRoute from "../features/auth/ui/jsx/ProtectedRoute";

function Home() {
    return (
        <ProtectedRoute>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000" }}>
                <h1 style={{ color: "#fff", fontSize: "24px" }}>Welcome to Chat</h1>
            </div>
        </ProtectedRoute>
    );
}

export default Home;
