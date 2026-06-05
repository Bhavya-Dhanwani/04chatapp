"use client";

import { useRef, useState, useEffect } from "react";
import styles from "../css/OtpInput.module.css";

function OtpInput({ length = 6, onChange }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        onChange?.(newOtp.join(""));
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

        if (pastedData) {
            const newOtp = pastedData.split("").concat(Array(length).fill("")).slice(0, length);
            setOtp(newOtp);

            const nextIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();

            onChange?.(newOtp.join(""));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
                onChange?.(newOtp.join(""));
            } else if (index > 0) {
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
                onChange?.(newOtp.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    return (
        <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`${styles.otpInput} ${digit ? styles.filled : ""}`}
                />
            ))}
        </div>
    );
}

export default OtpInput;
