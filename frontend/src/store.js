import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/state/authSlice";

export const makeStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
        },
    });
