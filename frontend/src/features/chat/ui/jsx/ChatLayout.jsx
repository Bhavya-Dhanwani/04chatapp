"use client";

// Importing hooks from react
import { useState } from "react";

// Importing the tab screens
import ChatsScreen from "./ChatsScreen";
import BottomNav from "./BottomNav";
import DesktopLayout from "./DesktopLayout";

// Importing the desktop media-query hook
import { useIsDesktop } from "../../hooks/useIsDesktop";

// Importing CSS module for layout styling
import styles from "../css/ChatLayout.module.css";

// Placeholder screen shown for tabs that aren't built yet
function StubScreen({ title }) {
    return (
        <div className={styles.stub}>
            <h2 className={styles.stubTitle}>{title}</h2>
            <p className={styles.stubSubtitle}>Coming soon</p>
        </div>
    );
}

// Main chat layout: switches between the desktop 3-column layout and the mobile phone shell
function ChatLayout() {

    // Tracking whether we're on a desktop-sized viewport
    const isDesktop = useIsDesktop(900);

    // Local state for the currently active mobile tab
    const [activeTab, setActiveTab] = useState("chats");

    // Rendering the desktop layout on wider viewports
    if (isDesktop) {
        return <DesktopLayout />;
    }

    // Picking the body component based on the active mobile tab
    let body;
    if (activeTab === "chats") {
        body = <ChatsScreen />;
    } else if (activeTab === "status") {
        body = <StubScreen title="Status" />;
    } else if (activeTab === "calls") {
        body = <StubScreen title="Calls" />;
    } else if (activeTab === "communities") {
        body = <StubScreen title="Communities" />;
    } else if (activeTab === "settings") {
        body = <StubScreen title="Settings" />;
    }

    return (
        <div className={styles.viewport}>
            <div className={styles.shell}>
                <main className={styles.main}>{body}</main>
                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        </div>
    );
}

export default ChatLayout;
