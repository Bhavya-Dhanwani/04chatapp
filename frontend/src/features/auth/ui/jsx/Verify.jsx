"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { verify, resendOtp, clearError } from "../../state/authSlice";
import { useToast } from "../../../../shared/ui/jsx/Toast";
import OtpInput from "./OtpInput";
import styles from "../css/Verify.module.css";

function Verify() {
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [resendLoading, setResendLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const toast = useToast();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async () => {
        if (otp.length !== 6) return;
        dispatch(clearError());

        const result = await dispatch(verify(otp));
        if (verify.fulfilled.match(result)) {
            toast.success("Verified", "Account verified successfully");
            router.push("/");
        } else {
            toast.error("Verification failed", result.payload);
        }
    };

    const handleResend = useCallback(async () => {
        setResendLoading(true);
        dispatch(clearError());

        const result = await dispatch(resendOtp());
        if (resendOtp.fulfilled.match(result)) {
            toast.success("OTP sent", "OTP resent successfully");
            setCountdown(60);
        } else {
            toast.error("Failed", result.payload);
        }
        setResendLoading(false);
    }, [dispatch, toast]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <h2 className={styles.title}>Verify your account</h2>
                <p className={styles.subtitle}>
                    We&apos;ve sent a 6-digit OTP to
                </p>
                <p className={styles.emailText}>{user?.email || "your email"}</p>

                <OtpInput length={6} onChange={setOtp} />

                <button
                    className={styles.submitBtn}
                    onClick={handleVerify}
                    disabled={loading || otp.length !== 6}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                {error && <p className={styles.errorText}>{error}</p>}

                <div className={styles.resendSection}>
                    {countdown > 0 ? (
                        <span className={styles.resendBtn} style={{ color: "#737373", cursor: "default" }}>
                            Resend OTP in {formatTime(countdown)}
                        </span>
                    ) : (
                        <button
                            className={styles.resendBtn}
                            onClick={handleResend}
                            disabled={resendLoading}
                        >
                            {resendLoading ? "Sending..." : "Resend OTP"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Verify;
