"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "../../../../shared/ui/jsx/Toast";
import api from "../../../../app/api";
import Link from "next/link";
import styles from "../css/ResetPassword.module.css";
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function ResetPassword() {
    const params = useParams();
    const router = useRouter();
    const token = params.token;
    const toast = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validatePassword = (pwd) => {
        if (pwd.length < 6) return "Password must be at least 6 characters";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Password is required");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/resetpassword", { token, newPassword: password });
            setSuccess(true);
            toast.success("Success", "Password reset successful");
            setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            const message = err.response?.data?.message || "Password reset failed";
            setError(message);
            toast.error("Error", message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authBox}>
                    <div className={styles.noTokenBox}>
                        <div className={styles.noTokenIcon}>
                            <RiLockLine />
                        </div>
                        <h2 className={styles.noTokenTitle}>Invalid Link</h2>
                        <p className={styles.noTokenMessage}>
                            This password reset link is invalid or missing a token.
                        </p>
                        <button
                            className={styles.linkBtn}
                            onClick={() => router.push("/forgotpassword")}
                        >
                            Request a new reset link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authBox}>
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>
                            <RiLockLine />
                        </div>
                        <h2 className={styles.successTitle}>Password Reset</h2>
                        <p className={styles.successMessage}>
                            Your password has been reset successfully. Redirecting to login...
                        </p>
                        <Link href="/login" className={styles.loginLink}>
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <h2 className={styles.title}>Reset Password</h2>
                <p className={styles.subtitle}>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <RiLockLine />
                        </span>
                        <input
                            className={styles.inputField}
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.eyeIcon}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                        </button>
                    </div>

                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <RiLockLine />
                        </span>
                        <input
                            className={styles.inputField}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.eyeIcon}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                        </button>
                    </div>

                    <p className={styles.passwordRules}>
                        Password must be at least 6 characters
                    </p>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button
                        className={styles.submitBtn}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
