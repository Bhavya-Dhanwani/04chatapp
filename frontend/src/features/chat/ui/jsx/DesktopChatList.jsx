"use client";

// Importing hooks from react
import { useEffect, useRef, useState } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { RiArrowDownSLine, RiEditBoxLine, RiSearchLine, RiLockPasswordLine, RiUserSettingsLine, RiUserLine } from "react-icons/ri";

// Importing chat slice action
import { fetchChats } from "../../state/chatSlice";

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
    const { chats, loading, error, loaded } = useSelector((state) => state.chat);

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

    // Filtering chats by search query against each participant's name
    const filteredChats = chats.filter((chat) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
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
                    <ChatListItem
                        key={chat._id}
                        chat={chat}
                        currentUserId={user?.id}
                        isSelected={selectedChatId === chat._id}
                        onClick={() => onSelectChat?.(chat)}
                    />
                ))}
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
