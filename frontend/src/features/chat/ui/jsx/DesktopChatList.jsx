"use client";

// Importing hooks from react
import { useEffect, useRef, useState, useCallback } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { RiArrowDownSLine, RiEditBoxLine, RiSearchLine, RiLockPasswordLine, RiUserSettingsLine, RiUserLine } from "react-icons/ri";

// Importing chat slice action
import { fetchChats, accessOrCreateChat } from "../../state/chatSlice";

// Importing user API
import { userApi } from "../../../user/api/userApi";

// Importing the change-password / change-profile-pic modals
import ChangePasswordModal from "../../../user/ui/jsx/ChangePasswordModal";
import ChangeProfilePicModal from "../../../user/ui/jsx/ChangeProfilePicModal";

// Importing the "Make some friends" modal
import MakeFriendsModal from "./MakeFriendsModal";

// Importing sibling components
import EmptyChats from "./EmptyChats";
import ChatListItem from "./ChatListItem";

// Importing CSS module for the desktop chat list column
import styles from "../css/DesktopChatList.module.css";

// Which modal (if any) is currently open
const NO_MODAL = null;
const PASSWORD_MODAL = "password";
const PFP_MODAL = "profilePic";
const FRIENDS_MODAL = "friends";

// Chat list column for the desktop layout (username header + search + list)
function DesktopChatList({ selectedChatId, onSelectChat }) {

    // Local state for search input
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // User search results for the search bar
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

    // Dropdown + modal state
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(NO_MODAL);

    // Bumped on every "open" so the modal remounts and its form state resets
    const [modalKey, setModalKey] = useState(0);

    // Refs for click-outside detection on the dropdown
    const menuRef = useRef(null);
    const usernameBtnRef = useRef(null);

    // Getting dispatch and chat state from redux
    const dispatch = useDispatch();
    const { chats, loading, error, loaded, onlineUsers, unreadCounts } = useSelector((state) => state.chat);

    // Getting current user for the username header
    const { user } = useSelector((state) => state.auth);

    // Effect: fetch chats on mount (only if not yet loaded)
    useEffect(() => {
        if (!loaded) {
            dispatch(fetchChats());
        }
    }, [dispatch, loaded]);

    // Effect: close the dropdown when clicking outside the username button / menu
    useEffect(() => {
        if (!menuOpen) return;

        const handleClick = (e) => {
            if (
                menuRef.current?.contains(e.target) ||
                usernameBtnRef.current?.contains(e.target)
            ) {
                return;
            }
            setMenuOpen(false);
        };

        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

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
        setModalKey((k) => k + 1);
        setActiveModal(FRIENDS_MODAL);
    };

    // When a chat is created via the discovery modal, select it so the right panel opens it
    const handleChatCreated = (chat) => {
        if (chat) onSelectChat?.(chat);
    };

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

    // Menu item handlers (close dropdown, open the matching modal)
    const openPasswordModal = () => {
        setMenuOpen(false);
        setModalKey((k) => k + 1);
        setActiveModal(PASSWORD_MODAL);
    };

    const openPfpModal = () => {
        setMenuOpen(false);
        setModalKey((k) => k + 1);
        setActiveModal(PFP_MODAL);
    };

    const closeModal = () => setActiveModal(NO_MODAL);

    // Computing first letter of the user's name for the avatar placeholder
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

    // Computing the display username (fallback to "you" if name missing)
    const displayUsername = user?.name || "you";

    // Determining what to render in the body area
    let body;
    const isSearching = debouncedSearch.trim().length > 0;

    if (loading && !loaded) {
        body = <p className={styles.statusMsg}>Loading chats...</p>;
    } else if (error) {
        body = <p className={styles.statusMsg}>Couldn&apos;t load chats.</p>;
    } else if (chats.length === 0 && !isSearching) {
        body = <EmptyChats onMakeFriends={handleMakeFriends} />;
    } else if (isSearching) {
        // Show user search results + matching chats
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
                                        isSelected={selectedChatId === chat._id}
                                        onClick={() => onSelectChat?.(chat)}
                                        isOnline={isOnline}
                                        unreadCount={unreadCount}
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
                            isSelected={selectedChatId === chat._id}
                            onClick={() => onSelectChat?.(chat)}
                            isOnline={isOnline}
                            unreadCount={unreadCount}
                        />
                    );
                })}
            </ul>
        );
    }

    return (
        <section className={styles.column}>

            {/* Username header */}
            <header className={styles.header}>

                {/* User avatar (PFP or initial fallback) */}
                <div className={styles.headerAvatar} aria-hidden="true">
                    {user?.profilePic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.profilePic} alt="" className={styles.headerAvatarImg} />
                    ) : user?.name ? (
                        <span className={styles.headerAvatarInitial}>{initial}</span>
                    ) : (
                        <RiUserLine className={styles.headerAvatarPlaceholder} />
                    )}
                </div>

                <button
                    ref={usernameBtnRef}
                    type="button"
                    className={styles.usernameBtn}
                    aria-label="Account menu"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <span className={styles.username}>{displayUsername}</span>
                    <RiArrowDownSLine className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ""}`} />
                </button>
                <button type="button" className={styles.iconBtn} aria-label="New chat">
                    <RiEditBoxLine />
                </button>
            </header>

            {/* Account dropdown menu */}
            {menuOpen && (
                <div ref={menuRef} className={styles.dropdown} role="menu">
                    <button
                        type="button"
                        className={styles.dropdownItem}
                        role="menuitem"
                        onClick={openPasswordModal}
                    >
                        <RiLockPasswordLine className={styles.dropdownIcon} />
                        <span>Change password</span>
                    </button>
                    <button
                        type="button"
                        className={styles.dropdownItem}
                        role="menuitem"
                        onClick={openPfpModal}
                    >
                        <RiUserSettingsLine className={styles.dropdownIcon} />
                        <span>Change profile picture</span>
                    </button>
                </div>
            )}

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

            {/* Body (list / empty / loading / error) */}
            <div className={styles.body}>{body}</div>

            {/* Account-action modals (key bumps on every open so internal state resets) */}
            <ChangePasswordModal key={`pwd-${modalKey}`} open={activeModal === PASSWORD_MODAL} onClose={closeModal} />
            <ChangeProfilePicModal key={`pfp-${modalKey}`} open={activeModal === PFP_MODAL} onClose={closeModal} />
            <MakeFriendsModal key={`friends-${modalKey}`} open={activeModal === FRIENDS_MODAL} onClose={closeModal} onChatCreated={handleChatCreated} />
        </section>
    );
}

export default DesktopChatList;
