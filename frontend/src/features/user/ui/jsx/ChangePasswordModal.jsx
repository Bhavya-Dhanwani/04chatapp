"use client";

// Importing hooks from react
import { useEffect, useMemo, useState } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

// Importing the change-password thunk
import { changePassword, clearError } from "../../../auth/state/authSlice";

// Importing the shared toast hook
import { useToast } from "../../../../shared/ui/jsx/Toast";

// Importing the generic modal
import Modal from "../../../../shared/ui/jsx/Modal";

// Importing CSS module
import styles from "../css/ChangePasswordModal.module.css";

// Modal dialog for changing the logged-in user's password
function ChangePasswordModal({ open, onClose }) {

    // Local form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Redux bindings
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    // Toast hook
    const toast = useToast();

    // Clear any stale auth errors when this modal is being shown
    useEffect(() => {
        if (open) dispatch(clearError());
    }, [open, dispatch]);

    // Client-side validation message (returns null if valid)
    const validationError = useMemo(() => {
        if (!currentPassword) return "Enter your current password";
        if (newPassword.length < 6) return "New password must be at least 6 characters";
        if (newPassword === currentPassword) return "New password must be different from the current password";
        if (newPassword !== confirmPassword) return "Passwords do not match";
        return null;
    }, [currentPassword, newPassword, confirmPassword]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validationError) return;

        // Dispatching the thunk
        const result = await dispatch(changePassword({ currentPassword, newPassword }));

        if (changePassword.fulfilled.match(result)) {
            toast.success("Password changed", "Your password was updated");
            onClose?.();
        } else {
            toast.error("Could not change password", result.payload || "Unknown error");
        }
    };

    // Helper to wire label + input + icon together
    const renderField = (id, label, value, setValue, show, setShow, placeholder) => (
        <div className={styles.fieldGroup}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><RiLockLine /></span>
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    className={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button
                    type="button"
                    className={styles.eyeIcon}
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
            </div>
        </div>
    );

    return (
        <Modal open={open} onClose={onClose} title="Change password" maxWidth={420}>
            <form onSubmit={handleSubmit} className={styles.form}>
                {renderField("cp-current", "Current password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent, "Enter current password")}
                {renderField("cp-new", "New password", newPassword, setNewPassword, showNew, setShowNew, "At least 6 characters")}
                {renderField("cp-confirm", "Confirm new password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, "Re-enter new password")}

                {validationError && <p className={styles.errorText}>{validationError}</p>}
                {error && <p className={styles.errorText}>{error}</p>}

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading || !!validationError}
                    >
                        {loading ? "Saving..." : "Change password"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ChangePasswordModal;
