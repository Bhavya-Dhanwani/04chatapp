"use client";

import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import styles from "../css/Login.module.css";
import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
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
                <h2 className={styles.title}>Welcome back</h2>
                <p className={styles.subtitle}>Login to continue</p>

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

                    <a href="#" className={styles.forgotLink}>Forgot Password?</a>

                    <button
                        className={styles.submitBtn}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                {error && <p className={styles.errorText}>{error}</p>}

                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <span className={styles.dividerText}>OR</span>
                    <div className={styles.dividerLine}></div>
                </div>

                <div className={styles.signupBox}>
                    <span>
                        Don&apos;t have an account?<a href="/signup">Sign Up</a>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
