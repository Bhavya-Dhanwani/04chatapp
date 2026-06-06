"use client";

// Importing hooks from react
import { useEffect, useState } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { RiArrowDownSLine, RiEditBoxLine, RiSearchLine, RiAddLine, RiPlayFill } from "react-icons/ri";

// Importing chat slice action
import { fetchChats } from "../../state/chatSlice";

// Importing the toast hook
import { useToast } from "../../../../shared/ui/jsx/Toast";

// Importing sibling components
import EmptyChats from "./EmptyChats";
import ChatListItem from "./ChatListItem";

// Importing CSS module for the desktop chat list column
import styles from "../css/DesktopChatList.module.css";

// Tabs shown across the top of the desktop chat list column
const TABS = [
    { id: "primary", label: "Primary" },
    { id: "general", label: "General" },
    { id: "requests", label: "Requests" },
];

// Chat list column for the desktop layout (username header + tabs + search + notes + list)
function DesktopChatList({ selectedChatId, onSelectChat }) {

    // Local state for search input
    const [search, setSearch] = useState("");

    // Local state for the active tab (visual only for now)
    const [activeTab, setActiveTab] = useState("primary");

    // Getting dispatch and chat state from redux
    const dispatch = useDispatch();
    const { chats, loading, error, loaded } = useSelector((state) => state.chat);

    // Getting current user for the username header + "Your note" bubble
    const { user } = useSelector((state) => state.auth);

    // Getting the toast hook
    const toast = useToast();

    // Effect to fetch chats on mount (only if not yet loaded)
    useEffect(() => {
        if (!loaded) {
            dispatch(fetchChats());
        }
    }, [dispatch, loaded]);

    // Filtering chats by search query against each participant's name
    const filteredChats = chats.filter((chat) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return chat.participants?.some((p) => p?.name?.toLowerCase().includes(q));
    });

    // Handler for the "Make some friends" CTA in the empty state
    const handleMakeFriends = () => {
        toast.info("Coming soon", "Friend discovery is on the way");
    };

    // Computing first letter of the user's name for the avatar placeholder
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

    // Computing the display username (fallback to "you" if name missing)
    const displayUsername = user?.name || "you";

    // Determining what to render in the body area
    let body;
    if (loading && !loaded) {
        body = <p className={styles.statusMsg}>Loading chats...</p>;
    } else if (error) {
        body = <p className={styles.statusMsg}>Couldn&apos;t load chats.</p>;
    } else if (chats.length === 0) {
        body = <EmptyChats onMakeFriends={handleMakeFriends} />;
    } else if (filteredChats.length === 0) {
        body = <p className={styles.statusMsg}>No chats match &quot;{search}&quot;</p>;
    } else {
        body = (
            <ul className={styles.chatList}>
                {filteredChats.map((chat) => (
                    <li
                        key={chat._id}
                        className={`${styles.chatRow} ${selectedChatId === chat._id ? styles.chatRowActive : ""}`}
                        onClick={() => onSelectChat?.(chat)}
                    >
                        <ChatListItem chat={chat} currentUserId={user?.id} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className={styles.column}>

            {/* Username header */}
            <header className={styles.header}>
                <button type="button" className={styles.usernameBtn} aria-label="Switch account">
                    <span className={styles.username}>{displayUsername}</span>
                    <RiArrowDownSLine className={styles.chevron} />
                </button>
                <button type="button" className={styles.iconBtn} aria-label="New chat">
                    <RiEditBoxLine />
                </button>
            </header>

            {/* Top tabs (Primary / General / Requests) */}
            <div className={styles.tabs}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className={styles.searchWrap}>
                <RiSearchLine className={styles.searchIcon} />
                <input
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Notes / stories strip */}
            <div className={styles.notesStrip}>
                <button type="button" className={styles.noteItem} aria-label="Your note">
                    <div className={styles.noteAvatar}>
                        {user?.profilePic ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profilePic} alt="" className={styles.noteAvatarImg} />
                        ) : (
                            <span className={styles.noteAvatarInitial}>{initial}</span>
                        )}
                        <span className={styles.noteAdd}>
                            <RiAddLine />
                        </span>
                    </div>
                    <span className={styles.noteLabel}>Your note</span>
                </button>
                {/* Placeholder "see more notes" pill from the mockup */}
                <button type="button" className={styles.notesMoreItem} aria-label="See more notes">
                    <div className={styles.notesMoreAvatar}>
                        <RiPlayFill className={styles.notesMoreIcon} />
                    </div>
                    <span className={styles.noteLabel}>More</span>
                </button>
            </div>

            {/* Body (list / empty / loading / error) */}
            <div className={styles.body}>{body}</div>
        </section>
    );
}

export default DesktopChatList;
