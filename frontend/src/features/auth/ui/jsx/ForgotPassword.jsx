"use client";

import { useState } from "react";
import { useToast } from "../../../../shared/ui/jsx/Toast";
import api from "../../../../app/api";
import styles from "../css/ForgotPassword.module.css";
import { HiOutlineMail } from "react-icons/hi";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/forgotpassword", { email });
            setSent(true);
            toast.success("Email sent", "Password reset email sent successfully");
        } catch (err) {
            const message = err.response?.data?.message || "Failed to send reset email";
            setError(message);
            toast.error("Error", message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authBox}>
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>
                            <HiOutlineMail />
                        </div>
                        <h2 className={styles.successTitle}>Check your email</h2>
                        <p className={styles.successMessage}>
                            We&apos;ve sent a password reset link to <strong>{email}</strong>.
                            Please check your inbox and spam folder.
                        </p>
                        <a href="/login" className={styles.loginLink}>
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <h2 className={styles.title}>Forgot Password?</h2>
                <p className={styles.subtitle}>
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <HiOutlineMail />
                        </span>
                        <input
                            className={styles.inputField}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button
                        className={styles.submitBtn}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <a href="/login" className={styles.backLink}>
                    Back to Login
                </a>
            </div>
        </div>
    );
}

export default ForgotPassword;
