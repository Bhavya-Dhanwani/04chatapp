"use client";

// Importing hooks from react
import { useSelector } from "react-redux";
import { useState } from "react";

// Importing column components
import LeftRail from "./LeftRail";
import DesktopChatList from "./DesktopChatList";
import ChatPanel from "./ChatPanel";

// Importing CSS module for the desktop layout
import styles from "../css/DesktopLayout.module.css";

// Three-column desktop layout: vertical icon rail + chat list + active conversation panel
function DesktopLayout() {

    // Local state for the currently selected chat (right panel content)
    const [selectedChat, setSelectedChat] = useState(null);

    // Getting current user id for participant filtering in the panel
    const { user } = useSelector((state) => state.auth);

    return (
        <div className={styles.layout}>
            <LeftRail />
            <DesktopChatList
                selectedChatId={selectedChat?._id}
                onSelectChat={setSelectedChat}
            />
            <ChatPanel selectedChat={selectedChat} currentUserId={user?.id} />
        </div>
    );
}

export default DesktopLayout;
