"use client";

// Importing hooks from react
import { useEffect, useRef } from "react";

// Importing icons from react-icons
import { RiCloseLine } from "react-icons/ri";

// Importing CSS module for modal styling
import styles from "../css/Modal.module.css";

// Generic dark-themed modal dialog with a backdrop and ESC-to-close support
function Modal({ open, onClose, title, children, maxWidth = 420 }) {

    // Keeping a ref to the modal panel for click-outside detection
    const panelRef = useRef(null);

    // Effect: lock body scroll while modal is open + handle ESC key
    useEffect(() => {
        if (!open) return;

        // Saving the previous overflow so we can restore it on close
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // Closing on ESC
        const handleKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onClose]);

    // Nothing to render when closed
    if (!open) return null;

    // Clicking the backdrop (but not the panel) closes the modal
    const handleBackdropClick = (e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) {
            onClose?.();
        }
    };

    return (
        <div className={styles.backdrop} onMouseDown={handleBackdropClick} role="presentation">
            <div
                ref={panelRef}
                className={styles.panel}
                style={{ maxWidth }}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <header className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <RiCloseLine />
                    </button>
                </header>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
}

export default Modal;
