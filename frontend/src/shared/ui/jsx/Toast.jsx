"use client";

// Importing hooks from react
import { createContext, useContext, useState, useCallback } from "react";

// Importing icons from react-icons
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiXCircle } from "react-icons/hi";

// Importing CSS module for toast styling
import styles from "../css/Toast.module.css";

// Creating toast context
const ToastContext = createContext(null);

// Counter for unique toast IDs
let toastId = 0;

// Toast provider component
export function ToastProvider({ children }) {

    // State to store toasts
    const [toasts, setToasts] = useState([]);

    // Function to add a toast
    const addToast = useCallback((type, title, message, duration = 4000) => {

        // Generating unique ID
        const id = ++toastId;

        // Adding new toast to state
        setToasts((prev) => [...prev, { id, type, title, message, removing: false }]);

        // Auto-dismissing toast after duration
        setTimeout(() => {

            // Starting removal animation
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
            );

            // Removing toast after animation
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    // Function to remove a toast
    const removeToast = useCallback((id) => {

        // Starting removal animation
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
        );

        // Removing toast after animation
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    // Toast type functions
    const success = useCallback((title, message) => addToast("success", title, message), [addToast]);
    const error = useCallback((title, message) => addToast("error", title, message), [addToast]);
    const warning = useCallback((title, message) => addToast("warning", title, message), [addToast]);
    const info = useCallback((title, message) => addToast("info", title, message), [addToast]);

    // Icons for different toast types
    const icons = {
        success: <HiCheckCircle className={styles.toastIcon} />,
        error: <HiXCircle className={styles.toastIcon} />,
        warning: <HiExclamationCircle className={styles.toastIcon} />,
        info: <HiInformationCircle className={styles.toastIcon} />,
    };

    // Rendering provider with toasts
    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}

            {/* Toast container */}
            <div className={styles.toastContainer}>

                {/* Rendering toasts */}
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`${styles.toast} ${styles[toast.type]} ${toast.removing ? styles.removing : ""}`}
                    >
                        {icons[toast.type]}

                        {/* Toast content */}
                        <div className={styles.toastContent}>
                            <div className={styles.toastTitle}>{toast.title}</div>
                            {toast.message && (
                                <div className={styles.toastMessage}>{toast.message}</div>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            className={styles.toastClose}
                            onClick={() => removeToast(toast.id)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Custom hook to use toast functionality
export function useToast() {

    // Getting toast context
    const context = useContext(ToastContext);

    // Throwing error if used outside provider
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    // Returning toast context
    return context;
}
