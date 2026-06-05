import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const data = await authApi.login(email, password);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const signup = createAsyncThunk("auth/signup", async ({ name, email, password }, { rejectWithValue }) => {
    try {
        const data = await authApi.signup(name, email, password);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
