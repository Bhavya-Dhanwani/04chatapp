// Importing modules from redux toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Importing chat API functions
import { chatApi } from "../api/chatApi";

// Async thunk to fetch the user's chat list
export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, { rejectWithValue }) => {
    try {

        // Calling chat API
        const data = await chatApi.getChats();

        // Returning the chat list (response shape: { success, message, data: [...] })
        return data.data || [];
    } catch (err) {

        // Logging error for debugging
        console.log("Fetch chats error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk to find or create a 1:1 chat with another user (used by the "Make some friends" flow)
export const accessOrCreateChat = createAsyncThunk("chat/accessOrCreateChat", async (userId, { rejectWithValue }) => {
    try {

        // Calling chat API
        const data = await chatApi.accessOrCreateChat(userId);

        // Returning the chat payload
        return data.data;
    } catch (err) {

        // Logging error for debugging
        console.log("Access or create chat error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Chat slice for managing chat list state
const chatSlice = createSlice({
    name: "chat",

    // Initial state for chat slice
    initialState: {
        chats: [],
        loading: false,
        error: null,
        loaded: false,
    },

    // Synchronous reducers
    reducers: {

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
        },
    },

    // Async reducers for handling thunk actions
    extraReducers: (builder) => {
        builder

            // Fetch chats pending state
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Fetch chats fulfilled state
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.chats = action.payload;
            })

            // Fetch chats rejected state
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.error = action.payload;
            })

            // Access or create chat pending state
            .addCase(accessOrCreateChat.pending, (state) => {
                state.error = null;
            })

            // Access or create chat fulfilled state - upsert the returned chat into the list
            .addCase(accessOrCreateChat.fulfilled, (state, action) => {
                const chat = action.payload;
                if (!chat?._id) return;

                // Removing any existing entry for this chat and prepending the fresh one so it shows at the top
                state.chats = [chat, ...state.chats.filter((c) => c?._id !== chat._id)];
            })

            // Access or create chat rejected state
            .addCase(accessOrCreateChat.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Exporting actions
export const { clearChatError, resetChats } = chatSlice.actions;

// Exporting reducer
export default chatSlice.reducer;
