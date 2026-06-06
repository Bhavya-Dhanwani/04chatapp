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
function ChatListItem({ chat, currentUserId, isSelected, onClick, isOnline, unreadCount }) {

    // Determining if this is a group chat
    const isGroup = chat.chatType === "group";

    // For group chats, use the group name; for direct chats, find the other participant
    const otherParticipant = isGroup ? null : chat.participants?.find((p) => p?._id !== currentUserId) || chat.participants?.[0];

    // Computing the display name
    const displayName = chat.name || otherParticipant?.name || "Unknown";

    // Computing the first letter for the avatar fallback
    const initial = displayName.trim().charAt(0).toUpperCase();

    // Computing the last message preview and timestamp
    const lastMessage = chat.lastMessage?.content || "";
    const timestamp = formatTime(chat.lastMessage?.createdAt || chat.updatedAt);

    // Whether to show the online indicator (only for direct chats, not self)
    const showOnline = !isGroup && isOnline;

    // Avatar: group chats show the initial; direct chats show the other participant's PFP
    const avatarContent = isGroup ? (
        <span className={styles.avatarInitial}>{initial}</span>
    ) : otherParticipant?.profilePic ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={otherParticipant.profilePic} alt="" className={styles.avatarImg} />
    ) : (
        <span className={styles.avatarInitial}>{initial}</span>
    );

    return (
        <li
            className={`${styles.item} ${isSelected ? styles.itemActive : ""}`}
            onClick={onClick}
        >
            <div className={styles.avatar}>
                {avatarContent}
                {showOnline && <span className={styles.onlineDot} />}
            </div>
            <div className={styles.content}>
                <div className={styles.topRow}>
                    <span className={styles.name}>{displayName}</span>
                    <div className={styles.topRight}>
                        {timestamp && <span className={styles.time}>{timestamp}</span>}
                        {unreadCount > 0 && (
                            <span className={styles.unreadBadge}>
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.bottomRow}>
                    <span className={styles.preview}>{lastMessage || "Say hi"}</span>
                </div>
            </div>
        </li>
    );
}

export default ChatListItem;
