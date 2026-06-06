"use client";

// Importing the tab screens
import ChatsScreen from "./ChatsScreen";
import BottomNav from "./BottomNav";
import DesktopLayout from "./DesktopLayout";

// Importing the desktop media-query hook
import { useIsDesktop } from "../../hooks/useIsDesktop";

// Importing CSS module for layout styling
import styles from "../css/ChatLayout.module.css";

// Main chat layout: switches between the desktop 3-column layout and the mobile phone shell
function ChatLayout() {

    // Tracking whether we're on a desktop-sized viewport
    const isDesktop = useIsDesktop(900);

    // Rendering the desktop layout on wider viewports
    if (isDesktop) {
        return <DesktopLayout />;
    }

    // Mobile shell: only the Chats screen is wired up; the bottom nav now shows the user's profile
    return (
        <div className={styles.viewport}>
            <div className={styles.shell}>
                <main className={styles.main}><ChatsScreen /></main>
                <BottomNav />
            </div>
        </div>
    );
}

export default ChatLayout;
