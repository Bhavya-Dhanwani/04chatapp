"use client";

// Importing CSS module for chat list item styling
import styles from "../css/ChatListItem.module.css";

// Helper to format a timestamp like "10:56 am" or "Yesterday"
function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    const now = new Date();
    const isSameDay = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isSameDay) {
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();
    }
    if (isYesterday) {
        return "Yesterday";
    }
    return date.toLocaleDateString();
}

// Component representing a single conversation row in the chat list
function ChatListItem({ chat, currentUserId }) {

    // Finding the "other" participant for one-on-one chats (fallback to first participant)
    const otherParticipant = chat.participants?.find((p) => p?._id !== currentUserId) || chat.participants?.[0];

    // Computing the display name (chat may eventually have a group name)
    const displayName = chat.name || otherParticipant?.name || "Unknown";

    // Computing the first letter for the avatar fallback
    const initial = displayName.trim().charAt(0).toUpperCase();

    // Computing the last message preview and timestamp
    const lastMessage = chat.lastMessage?.content || "";
    const timestamp = formatTime(chat.lastMessage?.createdAt || chat.updatedAt);

    return (
        <li className={styles.item}>
            <div className={styles.avatar}>
                {otherParticipant?.profilePic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={otherParticipant.profilePic} alt="" className={styles.avatarImg} />
                ) : (
                    <span className={styles.avatarInitial}>{initial}</span>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.topRow}>
                    <span className={styles.name}>{displayName}</span>
                    {timestamp && <span className={styles.time}>{timestamp}</span>}
                </div>
                <div className={styles.bottomRow}>
                    <span className={styles.preview}>{lastMessage || "Say hi"}</span>
                </div>
            </div>
        </li>
    );
}

export default ChatListItem;
