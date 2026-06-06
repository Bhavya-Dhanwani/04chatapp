"use client";

// Importing icons from react-icons
import { RiSendPlaneLine, RiChat3Line } from "react-icons/ri";

// Importing CSS module for the right side panel
import styles from "../css/ChatPanel.module.css";

// Right-hand chat panel for the desktop layout
function ChatPanel({ selectedChat, currentUserId }) {

    // Empty state shown when no chat is selected
    if (!selectedChat) {
        return (
            <section className={styles.panel}>
                <div className={styles.empty}>
                    <div className={styles.iconWrap}>
                        <RiSendPlaneLine className={styles.icon} />
                    </div>
                    <h2 className={styles.title}>Your messages</h2>
                    <p className={styles.subtitle}>Send private messages to a friend or group</p>
                </div>
            </section>
        );
    }

    // Computing the other participant for a basic header
    const other = selectedChat.participants?.find((p) => p?._id !== currentUserId) || selectedChat.participants?.[0];
    const displayName = selectedChat.name || other?.name || "Conversation";
    const initial = displayName.trim().charAt(0).toUpperCase();

    // Placeholder conversation view (messages are not yet wired up end-to-end)
    return (
        <section className={styles.panel}>
            <header className={styles.panelHeader}>
                <div className={styles.peerAvatar}>
                    {other?.profilePic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={other.profilePic} alt="" className={styles.peerAvatarImg} />
                    ) : (
                        <span className={styles.peerInitial}>{initial}</span>
                    )}
                </div>
                <div className={styles.peerMeta}>
                    <span className={styles.peerName}>{displayName}</span>
                    {other?.isVerified !== undefined && (
                        <span className={styles.peerStatus}>{other.isVerified ? "online" : "offline"}</span>
                    )}
                </div>
            </header>
            <div className={styles.placeholder}>
                <RiChat3Line className={styles.placeholderIcon} />
                <p className={styles.placeholderText}>Messages will appear here</p>
            </div>
        </section>
    );
}

export default ChatPanel;
