// Importing modules from redux toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Importing auth API functions
import { authApi } from "../api/authApi";

// Importing user API functions
import { userApi } from "../../user/api/userApi";

// Importing token management utilities
import { setAccessToken, clearAccessToken } from "../../../app/tokenStore";

// Async thunk for user login
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {

        // Calling login API
        const data = await authApi.login(email, password);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Login error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for user signup
export const signup = createAsyncThunk("auth/signup", async ({ name, email, password, profilePic, profilePicId }, { rejectWithValue }) => {
    try {

        // Calling signup API
        const data = await authApi.signup(name, email, password, profilePic, profilePicId);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Signup error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for account verification
export const verify = createAsyncThunk("auth/verify", async (otp, { rejectWithValue }) => {
    try {

        // Calling verify API
        const data = await authApi.verify(otp);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Verify error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for resending OTP
export const resendOtp = createAsyncThunk("auth/resendOtp", async (_, { rejectWithValue }) => {
    try {

        // Calling resend OTP API
        const data = await authApi.resendOtp();

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Resend OTP error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
    try {

        // Calling forgot password API
        const data = await authApi.forgotPassword(email);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Forgot password error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for reset password
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, newPassword }, { rejectWithValue }) => {
    try {

        // Calling reset password API
        const data = await authApi.resetPassword(token, newPassword);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Reset password error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for changing the logged-in user's password
export const changePassword = createAsyncThunk("auth/changePassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {

        // Calling change password API
        const data = await userApi.changePassword(currentPassword, newPassword);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Change password error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Async thunk for changing the logged-in user's profile picture URL
export const changeProfilePic = createAsyncThunk("auth/changeProfilePic", async ({ profilePic, profilePicId }, { rejectWithValue }) => {
    try {

        // Calling change profile picture API
        const data = await userApi.changeProfilePic(profilePic, profilePicId);

        // Returning the response data
        return data;
    } catch (err) {

        // Logging error for debugging
        console.log("Change profile pic error:", err);

        // Returning error message on failure
        return rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Auth slice for managing authentication state
const authSlice = createSlice({
    name: "auth",

    // Initial state for auth slice
    initialState: {
        user: null,
        loading: false,
        error: null,
    },

    // Synchronous reducers
    reducers: {

        // Reducer to clear error state
        clearError: (state) => {
            state.error = null;
        },

        // Reducer to logout user
        logout: (state) => {

            // Clearing user state
            state.user = null;

            // Clearing access token from storage
            clearAccessToken();
        },

        // Reducer to set user data
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },

        // Reducer to clear user data
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
        },
    },

    // Async reducers for handling thunk actions
    extraReducers: (builder) => {
        builder

            // Login pending state
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Login fulfilled state
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;

                // Storing access token if present
                if (action.payload.accessToken) {
                    setAccessToken(action.payload.accessToken);
                }
            })

            // Login rejected state
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Signup pending state
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Signup fulfilled state
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;

                // Storing access token if present
                if (action.payload.accessToken) {
                    setAccessToken(action.payload.accessToken);
                }
            })

            // Signup rejected state
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Verify pending state
            .addCase(verify.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Verify fulfilled state
            .addCase(verify.fulfilled, (state, action) => {
                state.loading = false;

                // Updating user verification status
                if (state.user) {
                    state.user.isVerified = true;
                }
            })

            // Verify rejected state
            .addCase(verify.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Resend OTP pending state
            .addCase(resendOtp.pending, (state) => {
                state.error = null;
            })

            // Resend OTP rejected state
            .addCase(resendOtp.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Forgot password pending state
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Forgot password fulfilled state
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })

            // Forgot password rejected state
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reset password pending state
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Reset password fulfilled state
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })

            // Reset password rejected state
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Change password pending state
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Change password fulfilled state
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;

                // Updating the user with the fresh data from the server
                if (action.payload?.data) {
                    state.user = action.payload.data;
                }
            })

            // Change password rejected state
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Change profile pic pending state
            .addCase(changeProfilePic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Change profile pic fulfilled state
            .addCase(changeProfilePic.fulfilled, (state, action) => {
                state.loading = false;

                // Updating the user with the fresh data from the server
                if (action.payload?.data) {
                    state.user = action.payload.data;
                }
            })

            // Change profile pic rejected state
            .addCase(changeProfilePic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Exporting actions
export const { clearError, logout, setUser, clearUser } = authSlice.actions;

// Exporting reducer
export default authSlice.reducer;
