"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket, emit, on, off } from "../../../../app/socket";
import {
    userOnline,
    userOffline,
    socketMessageReceived,
    userTyping,
    userStopTyping,
    messagesRead,
} from "../../state/chatSlice";

export default function useSocketEvents() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const chats = useSelector((state) => state.chat.chats);
    const chatsRef = useRef(chats);
    const setupDone = useRef(false);
    const dispatchRef = useRef(dispatch);
    dispatchRef.current = dispatch;

    // Keep chatsRef always up to date
    chatsRef.current = chats;

    const handleUserOnline = useCallback((userId) => {
        dispatchRef.current(userOnline(userId));
    }, []);

    const handleUserOffline = useCallback((userId) => {
        dispatchRef.current(userOffline(userId));
    }, []);

    const handleReceiveMessage = useCallback(({ chatId, message }) => {
        dispatchRef.current(socketMessageReceived({ chatId, message }));
    }, []);

    const handleUserTyping = useCallback(({ chatId, userId }) => {
        dispatchRef.current(userTyping({ chatId, userId }));
    }, []);

    const handleUserStopTyping = useCallback(({ chatId, userId }) => {
        dispatchRef.current(userStopTyping({ chatId, userId }));
    }, []);

    const handleMessagesRead = useCallback(({ chatId, readBy }) => {
        dispatchRef.current(messagesRead({ chatId, readBy }));
    }, []);

    const handleConnect = useCallback(() => {
        chatsRef.current.forEach((chat) => {
            emit("join_chat", chat._id);
        });
    }, []);

    useEffect(() => {
        chats.forEach((chat) => {
            if (chat?._id) {
                emit("join_chat", chat._id);
            }
        });
    }, [chats]);

    // Connect socket on mount, disconnect on unmount
    useEffect(() => {
        if (!user) return;
        connectSocket();
        return () => disconnectSocket();
    }, [user]);

    // Set up event listeners once
    useEffect(() => {
        if (!user || setupDone.current) return;
        setupDone.current = true;

        on("user_online", handleUserOnline);
        on("user_offline", handleUserOffline);
        on("receive_message", handleReceiveMessage);
        on("user_typing", handleUserTyping);
        on("user_stop_typing", handleUserStopTyping);
        on("messages_read", handleMessagesRead);
        on("connect", handleConnect);

        return () => {
            off("user_online", handleUserOnline);
            off("user_offline", handleUserOffline);
            off("receive_message", handleReceiveMessage);
            off("user_typing", handleUserTyping);
            off("user_stop_typing", handleUserStopTyping);
            off("messages_read", handleMessagesRead);
            off("connect", handleConnect);
            setupDone.current = false;
        };
    }, [user, handleUserOnline, handleUserOffline, handleReceiveMessage, handleUserTyping, handleUserStopTyping, handleMessagesRead, handleConnect]);
}
