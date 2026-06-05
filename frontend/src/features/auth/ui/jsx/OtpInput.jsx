"use client";

// Importing hooks from react
import { useRef, useState, useEffect } from "react";

// Importing CSS module for OTP input styling
import styles from "../css/OtpInput.module.css";

// OTP Input component with 6 separate input boxes
// Supports auto-focus, paste, and keyboard navigation
function OtpInput({ length = 6, onChange }) {

    // State to store OTP digits
    const [otp, setOtp] = useState(Array(length).fill(""));

    // Refs for input elements
    const inputRefs = useRef([]);

    // Effect to focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Function to handle input change
    const handleChange = (index, value) => {

        // Only allow numeric digits
        if (!/^\d*$/.test(value)) return;

        // Updating OTP state with new value
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Calling onChange callback with complete OTP
        onChange?.(newOtp.join(""));
    };

    // Function to handle paste event
    const handlePaste = (e) => {

        // Prevent default paste behavior
        e.preventDefault();

        // Getting pasted data and removing non-digits
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

        // Distributing pasted digits across inputs
        if (pastedData) {
            const newOtp = pastedData.split("").concat(Array(length).fill("")).slice(0, length);
            setOtp(newOtp);

            // Focusing next empty input or last input
            const nextIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();

            // Calling onChange callback with complete OTP
            onChange?.(newOtp.join(""));
        }
    };

    // Function to handle keyboard navigation
    const handleKeyDown = (index, e) => {

        // Handling backspace key
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];

            // Clear current input if it has value
            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
                onChange?.(newOtp.join(""));
            } else if (index > 0) {

                // Clear previous input and focus it
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
                onChange?.(newOtp.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {

            // Focus previous input on left arrow
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {

            // Focus next input on right arrow
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Rendering OTP input container
    return (
        <div className={styles.otpContainer}>

            {/* Rendering input boxes */}
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

// Exporting OTP Input component
export default OtpInput;
