// Importing modules from redux toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Importing chat API functions
import { chatApi } from "../api/chatApi";

function getSenderId(message) {
    return message?.senderId?._id || message?.senderId || "";
}

function findMatchingTempMessageIndex(messages, message) {
    const senderId = getSenderId(message);
    return messages.findIndex((m) => (
        m._temp &&
        m.content === message.content &&
        getSenderId(m) === senderId
    ));
}

function sortMessagesByCreatedAt(messages) {
    messages.sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return aTime - bTime;
    });
}

function mergeMessages(messages, incomingMessages) {
    incomingMessages.forEach((message) => {
        if (!message?._id) return;

        const existingIdx = messages.findIndex((m) => m._id === message._id);
        if (existingIdx !== -1) {
            messages[existingIdx] = message;
            return;
        }

        const tempIdx = findMatchingTempMessageIndex(messages, message);
        if (tempIdx !== -1) {
            messages[tempIdx] = message;
            return;
        }

        messages.push(message);
    });

    sortMessagesByCreatedAt(messages);
}

// Async thunk to fetch the user's chat list
export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, { rejectWithValue }) => {
    try {
        const data = await chatApi.getChats();
        return data.data || [];
    } catch (err) {
        console.log("Fetch chats error:", err);
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk to find or create a 1:1 chat with another user
export const accessOrCreateChat = createAsyncThunk("chat/accessOrCreateChat", async (userId, { rejectWithValue }) => {
    try {
        const data = await chatApi.accessOrCreateChat(userId);
        return data.data;
    } catch (err) {
        console.log("Access or create chat error:", err);
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk to fetch messages for a specific chat
export const fetchMessages = createAsyncThunk("chat/fetchMessages", async ({ chatId, before }, { rejectWithValue }) => {
    try {
        const data = await chatApi.getMessages(chatId, { before });
        return { chatId, messages: data.data || [] };
    } catch (err) {
        console.log("Fetch messages error:", err);
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk to send a message in a chat
export const sendMessage = createAsyncThunk("chat/sendMessage", async ({ chatId, content }, { rejectWithValue }) => {
    try {
        const data = await chatApi.sendMessage(chatId, content);
        return { chatId, message: data.data };
    } catch (err) {
        console.log("Send message error:", err);
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Chat slice for managing chat list state
const chatSlice = createSlice({
    name: "chat",

    initialState: {
        chats: [],
        loading: false,
        error: null,
        loaded: false,

        // Messages keyed by chatId: { [chatId]: { messages: [], loading, error, loaded } }
        messagesByChat: {},

        // The chat currently open in the UI (null if none)
        activeChatId: null,

        // User IDs that are currently online: { [userId]: true }
        onlineUsers: {},

        // Unread message counts per chat: { [chatId]: number }
        unreadCounts: {},

        // User IDs currently typing per chat: { [chatId]: { [userId]: true } }
        typingUsers: {},
    },

    reducers: {

        // Set the active chat (also resets unread for that chat)
        setActiveChat: (state, action) => {
            const chatId = action.payload;
            state.activeChatId = chatId;
            // Reset unread count when opening a chat
            if (chatId) {
                state.unreadCounts[chatId] = 0;
            }
        },

        // Clear active chat
        clearActiveChat: (state) => {
            state.activeChatId = null;
        },

        // Reducer to clear chat error
        clearChatError: (state) => {
            state.error = null;
        },

        // Reducer to reset chat state on logout
        resetChats: (state) => {
            state.chats = [];
            state.loading = false;
            state.error = null;
            state.loaded = false;
            state.messagesByChat = {};
            state.activeChatId = null;
            state.onlineUsers = {};
            state.unreadCounts = {};
            state.typingUsers = {};
        },

        // Reducer to clear messages for a specific chat
        clearMessages: (state, action) => {
            const chatId = action.payload;
            delete state.messagesByChat[chatId];
        },

        // Socket event: user came online
        userOnline: (state, action) => {
            state.onlineUsers[action.payload] = true;
        },

        // Socket event: user went offline
        userOffline: (state, action) => {
            delete state.onlineUsers[action.payload];
        },

            // Socket event: received a new message via real-time
            socketMessageReceived: (state, action) => {
                const { chatId, message, chat: incomingChat } = action.payload;
                if (!message?._id) return;

            // Initialize chat messages bucket if needed
            if (!state.messagesByChat[chatId]) {
                state.messagesByChat[chatId] = { messages: [], loading: false, error: null, loaded: false };
            }

            const msgs = state.messagesByChat[chatId].messages;

            // Skip if the real message already exists. This can happen because the
            // sender receives both the REST response and the socket broadcast.
            const exists = msgs.some((m) => m._id === message._id);
            if (exists) return;

            const tempIdx = findMatchingTempMessageIndex(msgs, message);
            if (tempIdx !== -1) {
                msgs[tempIdx] = message;
            } else {
                // Append the new message
                msgs.push(message);
            }


            // Update or insert the chat row. For brand-new direct chats, recipients
            // learn about the chat from this socket payload before they can join it.
            const chat = state.chats.find((c) => c._id === chatId);
            if (incomingChat?._id) {
                incomingChat.lastMessage = message;
                incomingChat.updatedAt = message.createdAt;
                state.chats = [incomingChat, ...state.chats.filter((c) => c._id !== chatId)];
            } else if (chat) {
                chat.lastMessage = message;
                chat.updatedAt = message.createdAt;
                state.chats = [chat, ...state.chats.filter((c) => c._id !== chatId)];
            }

            // Increment unread count if this chat is NOT currently open
            if (state.activeChatId !== chatId) {
                state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
            }
        },

        // Socket event: user is typing
        userTyping: (state, action) => {
            const { chatId, userId } = action.payload;
            if (!state.typingUsers[chatId]) {
                state.typingUsers[chatId] = {};
            }
            state.typingUsers[chatId][userId] = true;
        },

        // Socket event: user stopped typing
        userStopTyping: (state, action) => {
            const { chatId, userId } = action.payload;
            if (state.typingUsers[chatId]) {
                delete state.typingUsers[chatId][userId];
            }
        },

        // Socket event: messages were read by someone
        messagesRead: (state, action) => {
            // Could track read receipts per message later
            const { chatId, readBy } = action.payload;
            // For now this is a no-op placeholder
        },

        // Seed online users from an API response
        setOnlineUsers: (state, action) => {
            const obj = {};
            action.payload.forEach((id) => { obj[id] = true; });
            state.onlineUsers = obj;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.error = action.payload;
            })

            .addCase(accessOrCreateChat.pending, (state) => {
                state.error = null;
            })
            .addCase(accessOrCreateChat.fulfilled, (state, action) => {
                const chat = action.payload;
                if (!chat?._id) return;
                state.chats = [chat, ...state.chats.filter((c) => c?._id !== chat._id)];
            })
            .addCase(accessOrCreateChat.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchMessages.pending, (state, action) => {
                const { chatId } = action.meta.arg;
                if (!state.messagesByChat[chatId]) {
                    state.messagesByChat[chatId] = { messages: [], loading: false, error: null, loaded: false };
                }
                state.messagesByChat[chatId].loading = true;
                state.messagesByChat[chatId].error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { chatId, messages } = action.payload;
                if (!state.messagesByChat[chatId]) {
                    state.messagesByChat[chatId] = { messages: [], loading: false, error: null, loaded: false };
                }
                state.messagesByChat[chatId].loading = false;
                state.messagesByChat[chatId].loaded = true;
                mergeMessages(state.messagesByChat[chatId].messages, messages);
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                const { chatId } = action.meta.arg;
                if (!state.messagesByChat[chatId]) {
                    state.messagesByChat[chatId] = { messages: [], loading: false, error: null, loaded: false };
                }
                state.messagesByChat[chatId].loading = false;
                state.messagesByChat[chatId].loaded = true;
                state.messagesByChat[chatId].error = action.payload;
            })

            .addCase(sendMessage.pending, (state, action) => {
                const { chatId, content, sender } = action.meta.arg;
                if (!state.messagesByChat[chatId]) {
                    state.messagesByChat[chatId] = { messages: [], loading: false, error: null, loaded: false };
                }
                state.messagesByChat[chatId].messages.push({
                    _id: `temp-${action.meta.requestId}`,
                    chatId,
                    senderId: sender || { _id: "", name: "", profilePic: "" },
                    content,
                    status: "sending",
                    createdAt: new Date().toISOString(),
                    _temp: true,
                    _requestId: action.meta.requestId,
                });
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { chatId, message } = action.payload;
                if (!state.messagesByChat[chatId]) return;

                const msgs = state.messagesByChat[chatId].messages;
                const existingIdx = msgs.findIndex((m) => m._id === message._id);
                const tempIdx = msgs.findIndex((m) => m._requestId === action.meta.requestId);

                if (existingIdx !== -1 && tempIdx !== -1 && existingIdx !== tempIdx) {
                    msgs[existingIdx] = message;
                    msgs.splice(tempIdx, 1);
                } else if (tempIdx !== -1) {
                    msgs[tempIdx] = message;
                } else if (existingIdx !== -1) {
                    msgs[existingIdx] = message;
                } else {
                    msgs.push(message);
                }

                const chat = state.chats.find((c) => c._id === chatId);
                if (chat) {
                    chat.lastMessage = message;
                    chat.updatedAt = message.createdAt;
                    state.chats = [chat, ...state.chats.filter((c) => c._id !== chatId)];
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                const { chatId } = action.meta.arg;
                if (!state.messagesByChat[chatId]) return;
                state.messagesByChat[chatId].messages = state.messagesByChat[chatId].messages.filter(
                    (m) => m._requestId !== action.meta.requestId
                );
                state.messagesByChat[chatId].error = action.payload;
            });
    },
});

// Exporting actions
export const {
    clearChatError,
    resetChats,
    clearMessages,
    setActiveChat,
    clearActiveChat,
    userOnline,
    userOffline,
    socketMessageReceived,
    userTyping,
    userStopTyping,
    messagesRead,
    setOnlineUsers,
} = chatSlice.actions;

// Exporting reducer
export default chatSlice.reducer;
