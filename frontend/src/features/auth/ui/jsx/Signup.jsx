"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../../state/authSlice";
import { imagekitApi } from "../../api/imagekitApi";
import { useToast } from "../../../../shared/ui/jsx/Toast";
import styles from "../css/Signup.module.css";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockLine, RiEyeLine, RiEyeOffLine, RiUserLine, RiCameraLine, RiCloseLine } from "react-icons/ri";

const MAX_PROFILE_PIC_BYTES = 5 * 1024 * 1024;

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const toast = useToast();

    const profilePreview = useMemo(
        () => (profileFile ? URL.createObjectURL(profileFile) : ""),
        [profileFile]
    );

    useEffect(() => {
        if (!profilePreview) return;
        return () => URL.revokeObjectURL(profilePreview);
    }, [profilePreview]);

    const handlePickFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file", "Please choose an image file");
            return;
        }
        if (file.size > MAX_PROFILE_PIC_BYTES) {
            toast.error("File too large", "Profile picture must be under 5 MB");
            return;
        }
        setProfileFile(file);
    };

    const handleRemoveFile = () => {
        setProfileFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        let profilePicUrl;
        let profilePicId;
        if (profileFile) {
            try {
                setUploading(true);
                const uploaded = await imagekitApi.uploadProfilePic(profileFile);
                profilePicUrl = uploaded.url;
                profilePicId = uploaded.fileId;
            } catch (err) {
                console.log("Profile pic upload error:", err);
                toast.error("Upload failed", err.message || "Could not upload profile picture");
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const result = await dispatch(signup({ name, email, password, profilePic: profilePicUrl, profilePicId }));
        if (signup.fulfilled.match(result)) {
            toast.success("Account created", "Please verify your email");
            router.push("/verify");
        } else {
            toast.error("Signup failed", result.payload);
        }
    };

    const submitDisabled = loading || uploading;

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
                    <div className={styles.avatarSection}>
                        <button
                            type="button"
                            className={styles.avatarPicker}
                            onClick={handlePickFile}
                            disabled={uploading}
                            aria-label="Choose profile picture"
                        >
                            {profilePreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profilePreview}
                                    alt="Profile preview"
                                    className={styles.avatarImage}
                                />
                            ) : (
                                <RiUserLine className={styles.avatarPlaceholder} />
                            )}
                            <span className={styles.avatarOverlay}>
                                <RiCameraLine />
                            </span>
                        </button>
                        {profileFile ? (
                            <button
                                type="button"
                                className={styles.avatarRemove}
                                onClick={handleRemoveFile}
                                disabled={uploading}
                            >
                                <RiCloseLine /> Remove
                            </button>
                        ) : (
                            <span className={styles.avatarHint}>Add profile picture (optional)</span>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className={styles.hiddenFileInput}
                            onChange={handleFileChange}
                        />
                    </div>

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
                        disabled={submitDisabled}
                    >
                        {uploading ? "Uploading picture..." : loading ? "Signing up..." : "Sign Up"}
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
                        Already have an account?<Link href="/login">Log In</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Signup;

