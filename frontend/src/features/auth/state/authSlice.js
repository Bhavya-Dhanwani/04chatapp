import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { setAccessToken, clearAccessToken } from "../../../app/tokenStore";

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const data = await authApi.login(email, password);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const signup = createAsyncThunk("auth/signup", async ({ name, email, password }, { rejectWithValue }) => {
    try {
        const data = await authApi.signup(name, email, password);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const verify = createAsyncThunk("auth/verify", async (otp, { rejectWithValue }) => {
    try {
        const data = await authApi.verify(otp);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (_, { rejectWithValue }) => {
    try {
        const data = await authApi.resendOtp();
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
    try {
        const data = await authApi.forgotPassword(email);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, newPassword }, { rejectWithValue }) => {
    try {
        const data = await authApi.resetPassword(token, newPassword);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
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
            clearAccessToken();
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
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
                if (action.payload.accessToken) {
                    setAccessToken(action.payload.accessToken);
                }
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
                if (action.payload.accessToken) {
                    setAccessToken(action.payload.accessToken);
                }
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verify.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verify.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    state.user.isVerified = true;
                }
            })
            .addCase(verify.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resendOtp.pending, (state) => {
                state.error = null;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logout, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
