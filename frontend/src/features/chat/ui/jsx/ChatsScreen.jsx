"use client";

// Importing hooks from react
import { useEffect, useState } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { HiOutlineCamera } from "react-icons/hi";
import { RiEditBoxLine, RiSearchLine, RiAddLine } from "react-icons/ri";

// Importing chat slice action
import { fetchChats } from "../../state/chatSlice";

// Importing the toast hook
import { useToast } from "../../../../shared/ui/jsx/Toast";

// Importing sibling components
import EmptyChats from "./EmptyChats";
import ChatListItem from "./ChatListItem";

// Importing CSS module for the chats screen
import styles from "../css/ChatsScreen.module.css";

// Static filter tabs displayed under the search bar (visual only for now)
const FILTERS = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "favourites", label: "Favourites" },
    { id: "groups", label: "Groups" },
];

// The Chats tab screen: header, notes, search, filter tabs, list or empty state
function ChatsScreen() {

    // Local state for search input
    const [search, setSearch] = useState("");

    // Local state for the currently selected filter tab
    const [filter, setFilter] = useState("all");

    // Getting dispatch and chat state from redux
    const dispatch = useDispatch();
    const { chats, loading, error, loaded } = useSelector((state) => state.chat);

    // Getting current user for the "Your note" bubble
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

    // Determining what to render in the main body area
    let body;
    if (loading && !loaded) {
        body = <p className={styles.statusMsg}>Loading chats...</p>;
    } else if (error) {
        body = <p className={styles.statusMsg}>Couldn&apos;t load chats. Pull to retry.</p>;
    } else if (chats.length === 0) {
        body = <EmptyChats onMakeFriends={handleMakeFriends} />;
    } else if (filteredChats.length === 0) {
        body = <p className={styles.statusMsg}>No chats match &quot;{search}&quot;</p>;
    } else {
        body = (
            <ul className={styles.chatList}>
                {filteredChats.map((chat) => (
                    <ChatListItem key={chat._id} chat={chat} currentUserId={user?.id} />
                ))}
            </ul>
        );
    }

    return (
        <div className={styles.screen}>

            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Chats</h1>
                <div className={styles.headerActions}>
                    <button type="button" className={styles.iconBtn} aria-label="Camera">
                        <HiOutlineCamera />
                    </button>
                    <button type="button" className={styles.iconBtn} aria-label="New chat">
                        <RiEditBoxLine />
                    </button>
                </div>
            </header>

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

            {/* Notes / stories strip (only "Your note" until we have story data) */}
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
            </div>

            {/* Filter tabs */}
            <div className={styles.filters}>
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        className={`${styles.filterTab} ${filter === f.id ? styles.filterTabActive : ""}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
                <button type="button" className={styles.filterAdd} aria-label="Add filter">
                    <RiAddLine />
                </button>
            </div>

            {/* Body */}
            <div className={styles.body}>{body}</div>
        </div>
    );
}

export default ChatsScreen;
