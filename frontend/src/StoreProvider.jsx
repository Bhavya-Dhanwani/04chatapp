"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { ToastProvider } from "./shared/ui/jsx/Toast";

export default function StoreProvider({ children }) {
    const storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }
    return (
        <Provider store={storeRef.current}>
            <ToastProvider>{children}</ToastProvider>
        </Provider>
    );
}
