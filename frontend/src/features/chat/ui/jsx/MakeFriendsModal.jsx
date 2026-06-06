"use client";

// Importing hooks from react
import { useEffect, useState } from "react";

// Importing hooks from react-redux
import { useDispatch } from "react-redux";

// Importing the user API to load a random sample of users
import { userApi } from "../../../user/api/userApi";

// Importing the thunk that finds/creates a 1:1 chat with the chosen user
import { accessOrCreateChat } from "../../state/chatSlice";

// Importing the shared toast hook for error feedback
import { useToast } from "../../../../shared/ui/jsx/Toast";

// Importing the generic modal (handles backdrop, ESC, scroll lock, close button)
import Modal from "../../../../shared/ui/jsx/Modal";

// Importing CSS module for the user list layout
import styles from "../css/MakeFriendsModal.module.css";

// Default number of users to load in one shot
const DEFAULT_LIMIT = 20;

// Modal that shows a scrollable list of random users the current user can pick to start a chat with
function MakeFriendsModal({ open, onClose, onChatCreated }) {

    // Local state for the loaded user list, loading flag, and per-row creating state
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [creatingId, setCreatingId] = useState(null);

    // Redux dispatch + toast hook
    const dispatch = useDispatch();
    const toast = useToast();

    // Load the random users every time the modal is opened
    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setErrorMsg(null);
            try {
                const data = await userApi.getRandomUsers(DEFAULT_LIMIT);
                if (cancelled) return;
                setUsers(data?.data || []);
            } catch (err) {
                if (cancelled) return;
                setErrorMsg(err.response?.data?.message || err.message || "Could not load users");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [open]);

    // Clicking a user: create (or open) the chat, close the modal, and notify the parent
    const handlePickUser = async (user) => {
        if (!user?._id || creatingId) return;

        setCreatingId(user._id);
        try {
            const result = await dispatch(accessOrCreateChat(user._id));
            if (accessOrCreateChat.fulfilled.match(result)) {
                toast.success("Chat started", `You can now chat with ${user.name}`);
                onChatCreated?.(result.payload);
                onClose?.();
            } else {
                toast.error("Could not start chat", result.payload || "Unknown error");
            }
        } catch (err) {
            toast.error("Could not start chat", err.message || "Unknown error");
        } finally {
            setCreatingId(null);
        }
    };

    // Building the body of the modal based on the current state
    let body;
    if (loading) {
        body = <p className={styles.statusMsg}>Loading people...</p>;
    } else if (errorMsg) {
        body = <p className={styles.statusMsg}>{errorMsg}</p>;
    } else if (users.length === 0) {
        body = <p className={styles.statusMsg}>No people to suggest right now</p>;
    } else {
        body = (
            <ul className={styles.userList}>
                {users.map((user) => {
                    const name = (user?.name || "?").trim();
                    const initial = name.charAt(0).toUpperCase();
                    const isCreating = creatingId === user._id;
                    return (
                        <li key={user._id}>
                            <button
                                type="button"
                                className={styles.userBtn}
                                onClick={() => handlePickUser(user)}
                                disabled={!!creatingId}
                                aria-label={`Start a chat with ${name}`}
                            >
                                <span className={styles.avatar}>
                                    {user.profilePic ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.profilePic} alt="" className={styles.avatarImg} />
                                    ) : (
                                        <span className={styles.avatarInitial}>{initial}</span>
                                    )}
                                </span>
                                <span className={styles.name}>
                                    {isCreating ? "Starting chat..." : name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <Modal open={open} onClose={onClose} title="Make some friends" maxWidth={380}>
            <div className={styles.container}>
                {body}
            </div>
        </Modal>
    );
}

export default MakeFriendsModal;
