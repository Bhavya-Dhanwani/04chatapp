"use client";

// Importing hooks
import { useState } from "react";
import { useSelector } from "react-redux";

// Importing the tab screens
import ChatsScreen from "./ChatsScreen";
import BottomNav from "./BottomNav";
import DesktopLayout from "./DesktopLayout";
import ChatPanel from "./ChatPanel";

// Importing the desktop media-query hook
import { useIsDesktop } from "../../hooks/useIsDesktop";

// Importing socket events hook
import useSocketEvents from "../hooks/useSocketEvents";

// Importing CSS module for layout styling
import styles from "../css/ChatLayout.module.css";

// Main chat layout: switches between the desktop 3-column layout and the mobile phone shell
function ChatLayout() {

    // Tracking whether we're on a desktop-sized viewport
    const isDesktop = useIsDesktop(900);

    // Mobile: currently selected chat (null = show list, object = show chat panel)
    const [mobileChat, setMobileChat] = useState(null);

    // Current user id for ChatPanel
    const { user } = useSelector((state) => state.auth);

    // Initialize socket connection and event listeners
    useSocketEvents();

    // Rendering the desktop layout on wider viewports
    if (isDesktop) {
        return <DesktopLayout />;
    }

    // Mobile shell: toggle between chat list and chat panel
    return (
        <div className={styles.viewport}>
            <div className={styles.shell}>
                <main className={styles.main}>
                    {mobileChat ? (
                        <ChatPanel
                            selectedChat={mobileChat}
                            currentUserId={user?.id}
                            onBack={() => setMobileChat(null)}
                        />
                    ) : (
                        <ChatsScreen onSelectChat={setMobileChat} />
                    )}
                </main>
                {!mobileChat && <BottomNav />}
            </div>
        </div>
    );
}

export default ChatLayout;
