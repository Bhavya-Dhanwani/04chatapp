"use client";

// Importing icons from react-icons
import { RiChat3Line, RiUserAddLine } from "react-icons/ri";

// Importing CSS module for empty state styling
import styles from "../css/EmptyChats.module.css";

// Empty state shown when the user has no chats yet
function EmptyChats({ onMakeFriends }) {

    // Rendering the empty state with an action button
    return (
        <div className={styles.empty}>
            <div className={styles.iconWrap}>
                <RiChat3Line className={styles.icon} />
            </div>
            <h2 className={styles.title}>No chats found</h2>
            <p className={styles.subtitle}>Make some friends to start chatting</p>
            <button type="button" className={styles.ctaBtn} onClick={onMakeFriends}>
                <RiUserAddLine />
                <span>Make some friends</span>
            </button>
        </div>
    );
}

export default EmptyChats;
