"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../../state/authSlice";
import { useToast } from "../../../../shared/ui/jsx/Toast";
import styles from "../css/Signup.module.css";
import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockLine, RiEyeLine, RiEyeOffLine, RiUserLine } from "react-icons/ri";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const result = await dispatch(signup({ name, email, password }));
        if (signup.fulfilled.match(result)) {
            toast.success("Account created", "Please verify your email");
            router.push("/verify");
        } else {
            toast.error("Signup failed", result.payload);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                    className={styles.logo}
                />
                <h1 className={styles.appName}>meelmilap</h1>
                <h2 className={styles.title}>Create your account</h2>
                <p className={styles.subtitle}>Join meelmilap and start your journey</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <RiUserLine />
                        </span>
                        <input
                            className={styles.inputField}
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>
                            <RiLockLine />
                        </span>
                        <input
                            className={styles.inputField}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
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
                    <p className={styles.passwordHint}>Password must be at least 6 characters</p>

                    <button
                        className={styles.submitBtn}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {error && <p className={styles.errorText}>{error}</p>}

                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <span className={styles.dividerText}>OR</span>
                    <div className={styles.dividerLine}></div>
                </div>

                <div className={styles.loginBox}>
                    <span>
                        Already have an account?<a href="/login">Log In</a>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Signup;
