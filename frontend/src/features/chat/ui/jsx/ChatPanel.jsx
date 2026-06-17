"use client";

// Importing hooks from react
import { useEffect, useRef, useState, useCallback } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { RiSendPlaneLine, RiChat3Line, RiArrowLeftLine } from "react-icons/ri";

// Importing chat slice actions
import { fetchMessages, sendMessage, setActiveChat, clearActiveChat } from "../../state/chatSlice";

// Importing socket utilities
import { emit, on, off } from "../../../../app/socket";

// Importing CSS module for the right side panel
import styles from "../css/ChatPanel.module.css";

// Helper to format a timestamp like "10:56 am"
function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();
}

// Right-hand chat panel for the desktop layout
function ChatPanel({ selectedChat, currentUserId, onBack }) {

    // Local state for the message input
    const [text, setText] = useState("");

    // Redux dispatch
    const dispatch = useDispatch();

    // Messages from redux state
    const messagesState = useSelector((state) => {
        if (!selectedChat?._id) return null;
        return state.chat.messagesByChat[selectedChat._id] || null;
    });

    const currentUser = useSelector((state) => state.auth.user);

    // Online status of the other user
    const isOnline = useSelector((state) => {
        if (!selectedChat || selectedChat.chatType === "group") return false;
        const otherUserId = selectedChat.participants?.find((p) => p?._id !== currentUserId)?._id;
        return otherUserId ? !!state.chat.onlineUsers[otherUserId] : false;
    });

    // Typing users for this chat (return stable ref to avoid rerender warning)
    const typingUsersMap = useSelector((state) => {
        if (!selectedChat?._id) return null;
        return state.chat.typingUsers[selectedChat._id] || null;
    });
    const typingUserIds = Object.keys(typingUsersMap || {});

    // Refs for auto-scrolling to the bottom
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const prevChatIdRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    // Fetching messages when a chat is selected (or when switching chats)
    useEffect(() => {
        if (!selectedChat?._id) {
            dispatch(clearActiveChat());
            return;
        }

        // Only fetch if this is a new chat selection
        if (prevChatIdRef.current !== selectedChat._id) {
            prevChatIdRef.current = selectedChat._id;
            dispatch(setActiveChat(selectedChat._id));
            dispatch(fetchMessages({ chatId: selectedChat._id }));

            // Join the socket room for this chat
            emit("join_chat", selectedChat._id);

            // Mark messages as read
            emit("mark_read", { chatId: selectedChat._id });
        }
    }, [selectedChat?._id, dispatch]);

    // Cleanup: clear active chat when unmounting
    useEffect(() => {
        return () => {
            dispatch(clearActiveChat());
        };
    }, [dispatch]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messagesState?.messages?.length]);

    // Mark as read when new messages arrive while chat is open
    useEffect(() => {
        if (selectedChat?._id && messagesState?.messages?.length) {
            emit("mark_read", { chatId: selectedChat._id });
        }
    }, [messagesState?.messages?.length, selectedChat?._id]);

    // Handle typing indicators
    const handleTypingStart = useCallback(() => {
        if (!isTypingRef.current && selectedChat?._id) {
            isTypingRef.current = true;
            emit("typing", { chatId: selectedChat._id });
        }
    }, [selectedChat?._id]);

    const handleTypingStop = useCallback(() => {
        if (isTypingRef.current && selectedChat?._id) {
            isTypingRef.current = false;
            emit("stop_typing", { chatId: selectedChat._id });
        }
    }, [selectedChat?._id]);

    // Handler for text input changes (with typing indicator logic)
    const handleTextChange = (e) => {
        setText(e.target.value);
        handleTypingStart();

        // Reset the stop-typing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            handleTypingStop();
        }, 2000);
    };

    // Handler for sending a message
    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || !selectedChat?._id) return;

        dispatch(sendMessage({
            chatId: selectedChat._id,
            content: trimmed,
            sender: {
                _id: currentUserId,
                name: currentUser?.name || "",
                profilePic: currentUser?.profilePic || "",
            },
        }));
        setText("");

        // Stop typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        handleTypingStop();
    };

    // Handler for pressing Enter in the input
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

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
    const isGroup = selectedChat.chatType === "group";
    const other = isGroup ? null : selectedChat.participants?.find((p) => p?._id !== currentUserId) || selectedChat.participants?.[0];
    const displayName = selectedChat.name || other?.name || "Conversation";
    const initial = displayName.trim().charAt(0).toUpperCase();

    // Message list
    const messages = messagesState?.messages || [];
    const loadingMessages = messagesState?.loading;

    // Typing indicator text
    const typingNames = Array.from(typingUserIds)
        .map((uid) => {
            const participant = selectedChat.participants?.find((p) => p?._id === uid);
            return participant?.name || "";
        })
        .filter(Boolean);
    const typingText = typingNames.length === 1
        ? `${typingNames[0]} is typing...`
        : typingNames.length > 1
            ? `${typingNames.join(", ")} are typing...`
            : "";

    return (
        <section className={styles.panel}>
            {/* Header */}
            <header className={styles.panelHeader}>
                {onBack && (
                    <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
                        <RiArrowLeftLine />
                    </button>
                )}
                <div className={styles.peerAvatar}>
                    {isGroup ? (
                        <span className={styles.peerInitial}>{initial}</span>
                    ) : other?.profilePic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={other.profilePic} alt="" className={styles.peerAvatarImg} />
                    ) : (
                        <span className={styles.peerInitial}>{initial}</span>
                    )}
                    {!isGroup && <span className={`${styles.statusDot} ${isOnline ? styles.statusDotOnline : ""}`} />}
                </div>
                <div className={styles.peerMeta}>
                    <span className={styles.peerName}>{displayName}</span>
                    {typingText ? (
                        <span className={styles.peerTyping}>{typingText}</span>
                    ) : !isGroup ? (
                        <span className={styles.peerStatus}>{isOnline ? "online" : "offline"}</span>
                    ) : (
                        <span className={styles.peerStatus}>{selectedChat.participants?.length || 0} members</span>
                    )}
                </div>
            </header>

            {/* Messages */}
            <div className={styles.messagesContainer} ref={messagesContainerRef}>
                {loadingMessages && messages.length === 0 ? (
                    <div className={styles.loadingMsg}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className={styles.emptyChat}>
                        <RiChat3Line className={styles.emptyChatIcon} />
                        <p className={styles.emptyChatText}>No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
                        const senderName = msg.senderId?.name || "";
                        return (
                            <div
                                key={msg._id}
                                className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}
                            >
                                {!isOwn && isGroup && (
                                    <span className={styles.senderName}>{senderName}</span>
                                )}
                                <span className={styles.bubbleContent}>{msg.content}</span>
                                <span className={styles.bubbleTime}>{formatTime(msg.createdAt)}</span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputBar}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
                <button
                    type="button"
                    className={styles.sendBtn}
                    onClick={handleSend}
                    disabled={!text.trim()}
                    aria-label="Send message"
                >
                    <RiSendPlaneLine />
                </button>
            </div>
        </section>
    );
}

export default ChatPanel;
