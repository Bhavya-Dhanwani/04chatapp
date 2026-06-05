"use client";

// Importing useRef hook from react
import { useRef } from "react";

// Importing Provider from react-redux
import { Provider } from "react-redux";

// Importing store maker function
import { makeStore } from "./store";

// Importing ToastProvider for toast notifications
import { ToastProvider } from "./shared/ui/jsx/Toast";

// Store provider component to wrap the application
export default function StoreProvider({ children }) {

    // Creating store reference
    const storeRef = useRef(null);

    // Initializing store if not already done
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    // Rendering providers
    return (
        <Provider store={storeRef.current}>
            <ToastProvider>{children}</ToastProvider>
        </Provider>
    );
}
