"use client";

import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import styles from "../css/Signup.module.css";
import Image from "next/image";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { signup, loading, error } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(name, email, password);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className={styles.logo}
                />
                <h1 className={styles.appName}>meelmilap</h1>
                <h2 className={styles.title}>Create your account</h2>
                <p className={styles.subtitle}>Join meelmilap and start your journey</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>👤</span>
                        <input
                            className={styles.inputField}
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>✉</span>
                        <input
                            className={styles.inputField}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputIcon}>🔒</span>
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
                            {showPassword ? "👁" : "👁‍🗨"}
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
