"use client";

import ProtectedRoute from "../features/auth/ui/jsx/ProtectedRoute";
import ChatLayout from "../features/chat/ui/jsx/ChatLayout";

function Home() {
    return (
        <ProtectedRoute>
            <ChatLayout />
        </ProtectedRoute>
    );
}

export default Home;
