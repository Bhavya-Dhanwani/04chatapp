"use client";

// Importing hooks from react
import { useEffect, useState } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { HiOutlineCamera } from "react-icons/hi";
import { RiEditBoxLine, RiSearchLine, RiAddLine } from "react-icons/ri";

// Importing chat slice action
import { fetchChats, accessOrCreateChat } from "../../state/chatSlice";

// Importing user API
import { userApi } from "../../../user/api/userApi";

// Importing sibling components
import EmptyChats from "./EmptyChats";
import ChatListItem from "./ChatListItem";

// Importing the "Make some friends" modal
import MakeFriendsModal from "./MakeFriendsModal";

// Importing CSS module for the chats screen
import styles from "../css/ChatsScreen.module.css";



// The Chats tab screen: header, notes, search, filter tabs, list or empty state
function ChatsScreen({ onSelectChat }) {

    // Local state for search input
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // User search results
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch user search results when debouncedSearch changes
    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSearchResults([]);
            return;
        }

        let cancelled = false;

        const fetchResults = async () => {
            setSearching(true);
            try {
                const res = await userApi.searchUsers(debouncedSearch, 10);
                if (!cancelled) {
                    setSearchResults(res.data || []);
                }
            } catch {
                if (!cancelled) setSearchResults([]);
            } finally {
                if (!cancelled) setSearching(false);
            }
        };

        fetchResults();
        return () => { cancelled = true; };
    }, [debouncedSearch]);

    // Local state for the "Make some friends" modal
    const [friendsModalOpen, setFriendsModalOpen] = useState(false);
    const [friendsModalKey, setFriendsModalKey] = useState(0);

    // Getting dispatch and chat state from redux
    const dispatch = useDispatch();
    const { chats, loading, error, loaded, onlineUsers, unreadCounts } = useSelector((state) => state.chat);

    // Getting current user for the "Your note" bubble
    const { user } = useSelector((state) => state.auth);

    // Effect to fetch chats on mount (only if not yet loaded)
    useEffect(() => {
        if (!loaded) {
            dispatch(fetchChats());
        }
    }, [dispatch, loaded]);

    // Filtering chats by search query against group name or participant names
    // Excludes group chats (like Global) so they don't visually overlap the "People" results
    const filteredChats = chats.filter((chat) => {
        if (!debouncedSearch.trim()) return true;
        if (chat.chatType === "group") return false;
        const q = debouncedSearch.trim().toLowerCase();
        if (chat.name?.toLowerCase().includes(q)) return true;
        return chat.participants?.some((p) => p?.name?.toLowerCase().includes(q));
    });

    // Handler for the "Make some friends" CTA in the empty state - opens the discovery modal
    const handleMakeFriends = () => {
        setFriendsModalKey((k) => k + 1);
        setFriendsModalOpen(true);
    };

    // Closing the discovery modal (no chat is auto-selected on mobile - the list will refresh instead)
    const closeFriendsModal = () => setFriendsModalOpen(false);

    // Handler for clicking a user search result — creates/opens a chat with that user
    const handleUserClick = async (userId) => {
        try {
            const result = await dispatch(accessOrCreateChat(userId)).unwrap();
            if (result) {
                setSearch("");
                setDebouncedSearch("");
                onSelectChat?.(result);
            }
        } catch (err) {
            console.error("Failed to create/open chat:", err);
        }
    };

    // Computing first letter of the user's name for the avatar placeholder
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

    // Determining what to render in the main body area
    let body;
    const isSearching = debouncedSearch.trim().length > 0;

    if (loading && !loaded) {
        body = <p className={styles.statusMsg}>Loading chats...</p>;
    } else if (error) {
        body = <p className={styles.statusMsg}>Couldn&apos;t load chats. Pull to retry.</p>;
    } else if (chats.length === 0 && !isSearching) {
        body = <EmptyChats onMakeFriends={handleMakeFriends} />;
    } else if (isSearching) {
        body = (
            <>
                {searchResults.length > 0 && (
                    <div className={styles.searchSection}>
                        <span className={styles.searchSectionLabel}>People</span>
                        <ul className={styles.chatList}>
                            {searchResults.map((u) => {
                                const uInitial = (u.name || "?").charAt(0).toUpperCase();
                                return (
                                    <li
                                        key={u._id}
                                        className={styles.searchUserItem}
                                        onClick={() => handleUserClick(u._id)}
                                    >
                                        <div className={styles.searchUserAvatar}>
                                            {u.profilePic ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={u.profilePic} alt="" className={styles.searchUserAvatarImg} />
                                            ) : (
                                                <span className={styles.searchUserInitial}>{uInitial}</span>
                                            )}
                                        </div>
                                        <span className={styles.searchUserName}>{u.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                {filteredChats.length > 0 && (
                    <div className={styles.searchSection}>
                        <span className={styles.searchSectionLabel}>Chats</span>
                        <ul className={styles.chatList}>
                            {filteredChats.map((chat) => {
                                const otherUserId = chat.participants?.find((p) => p?._id !== user?.id)?._id;
                                const isOnline = otherUserId ? !!onlineUsers[otherUserId] : false;
                                const unreadCount = unreadCounts[chat._id] || 0;
                                return (
                                    <ChatListItem
                                        key={chat._id}
                                        chat={chat}
                                        currentUserId={user?.id}
                                        isOnline={isOnline}
                                        unreadCount={unreadCount}
                                        onClick={() => onSelectChat?.(chat)}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                )}
                {!searching && searchResults.length === 0 && filteredChats.length === 0 && (
                    <p className={styles.statusMsg}>No results for &quot;{debouncedSearch}&quot;</p>
                )}
                {searching && searchResults.length === 0 && (
                    <p className={styles.statusMsg}>Searching...</p>
                )}
            </>
        );
    } else if (filteredChats.length === 0) {
        body = <p className={styles.statusMsg}>No chats match &quot;{debouncedSearch}&quot;</p>;
    } else {
        body = (
            <ul className={styles.chatList}>
                {filteredChats.map((chat) => {
                    const otherUserId = chat.participants?.find((p) => p?._id !== user?.id)?._id;
                    const isOnline = otherUserId ? !!onlineUsers[otherUserId] : false;
                    const unreadCount = unreadCounts[chat._id] || 0;

                    return (
                        <ChatListItem
                            key={chat._id}
                            chat={chat}
                            currentUserId={user?.id}
                            isOnline={isOnline}
                            unreadCount={unreadCount}
                            onClick={() => onSelectChat?.(chat)}
                        />
                    );
                })}
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

            {/* Notes / stories strip - "Your note" + online users */}
            {!isSearching && (
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
                    {chats
                        .filter((chat) => chat.chatType !== "group")
                        .map((chat) => {
                            const other = chat.participants?.find((p) => p?._id !== user?.id);
                            if (!other?._id) return null;
                            if (!onlineUsers[other._id]) return null;
                            const oInitial = (other.name || "?").charAt(0).toUpperCase();
                            return (
                                <button
                                    key={other._id}
                                    type="button"
                                    className={styles.noteItem}
                                    onClick={() => onSelectChat?.(chat)}
                                >
                                    <div className={styles.noteAvatarOnline}>
                                        {other.profilePic ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={other.profilePic} alt="" className={styles.noteAvatarImg} />
                                        ) : (
                                            <span className={styles.noteAvatarInitial}>{oInitial}</span>
                                        )}
                                    </div>
                                    <span className={styles.noteLabel}>{other.name}</span>
                                </button>
                            );
                        })
                    }
                </div>
            )}

            {/* Body */}
            <div className={styles.body}>{body}</div>

            {/* "Make some friends" discovery modal */}
            <MakeFriendsModal
                key={`friends-${friendsModalKey}`}
                open={friendsModalOpen}
                onClose={closeFriendsModal}
            />
        </div>
    );
}

export default ChatsScreen;
