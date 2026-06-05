"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiXCircle } from "react-icons/hi";
import styles from "../css/Toast.module.css";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, title, message, duration = 4000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, type, title, message, removing: false }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    const success = useCallback((title, message) => addToast("success", title, message), [addToast]);
    const error = useCallback((title, message) => addToast("error", title, message), [addToast]);
    const warning = useCallback((title, message) => addToast("warning", title, message), [addToast]);
    const info = useCallback((title, message) => addToast("info", title, message), [addToast]);

    const icons = {
        success: <HiCheckCircle className={styles.toastIcon} />,
        error: <HiXCircle className={styles.toastIcon} />,
        warning: <HiExclamationCircle className={styles.toastIcon} />,
        info: <HiInformationCircle className={styles.toastIcon} />,
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`${styles.toast} ${styles[toast.type]} ${toast.removing ? styles.removing : ""}`}
                    >
                        {icons[toast.type]}
                        <div className={styles.toastContent}>
                            <div className={styles.toastTitle}>{toast.title}</div>
                            {toast.message && (
                                <div className={styles.toastMessage}>{toast.message}</div>
                            )}
                        </div>
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

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
