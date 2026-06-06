"use client";

// Importing hooks from react
import { useEffect, useMemo, useRef, useState } from "react";

// Importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Importing icons from react-icons
import { RiUserLine, RiCameraLine, RiCloseLine } from "react-icons/ri";

// Importing the change-profile-pic thunk
import { changeProfilePic, clearError } from "../../../auth/state/authSlice";

// Importing the ImageKit API (reuses the presign + upload flow)
import { imagekitApi } from "../../../auth/api/imagekitApi";

// Importing the shared toast hook
import { useToast } from "../../../../shared/ui/jsx/Toast";

// Importing the generic modal
import Modal from "../../../../shared/ui/jsx/Modal";

// Importing CSS module
import styles from "../css/ChangeProfilePicModal.module.css";

// 5 MB upload limit (matches the signup flow)
const MAX_PROFILE_PIC_BYTES = 5 * 1024 * 1024;

// Modal dialog for changing the logged-in user's profile picture
function ChangeProfilePicModal({ open, onClose }) {

    // Ref to the hidden file input
    const fileInputRef = useRef(null);

    // Local state: selected file, preview URL, uploading flag
    const [profileFile, setProfileFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Redux bindings
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    // Toast hook
    const toast = useToast();

    // Preview URL derived from the selected file (and cleaned up automatically)
    const profilePreview = useMemo(
        () => (profileFile ? URL.createObjectURL(profileFile) : ""),
        [profileFile]
    );

    useEffect(() => {
        if (!profilePreview) return;
        return () => URL.revokeObjectURL(profilePreview);
    }, [profilePreview]);

    // Clear any stale auth errors when this modal is being shown
    useEffect(() => {
        if (open) dispatch(clearError());
    }, [open, dispatch]);

    // Trigger the hidden file input
    const handlePickFile = () => {
        fileInputRef.current?.click();
    };

    // Handle file selection: validate type + size
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

    // Remove the selected file before submitting
    const handleRemoveFile = () => {
        setProfileFile(null);
    };

    // Submit: upload to ImageKit, then PATCH /api/users/me/profile-pic
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profileFile) return;

        let profilePicUrl;
        let profilePicId;
        try {
            setUploading(true);
            const uploaded = await imagekitApi.uploadProfilePic(profileFile);
            console.log("ImageKit upload response:", uploaded);
            profilePicUrl = uploaded?.url;
            profilePicId = uploaded?.fileId;
        } catch (err) {
            console.log("Profile pic upload error:", err);
            toast.error("Upload failed", err.message || "Could not upload profile picture");
            setUploading(false);
            return;
        }

        // Guard: if the upload succeeded but ImageKit didn't return a URL, stop here
        if (!profilePicUrl || typeof profilePicUrl !== "string") {
            console.log("Missing profilePicUrl from upload response");
            toast.error("Upload failed", "ImageKit did not return a file URL");
            setUploading(false);
            return;
        }

        const result = await dispatch(changeProfilePic({ profilePic: profilePicUrl, profilePicId }));
        setUploading(false);

        if (changeProfilePic.fulfilled.match(result)) {
            toast.success("Profile updated", "Your profile picture was changed");
            onClose?.();
        } else {
            toast.error("Could not save", result.payload || "Unknown error");
        }
    };

    // Existing PFP from the user, used as a fallback preview
    const existingPic = user?.profilePic;

    return (
        <Modal open={open} onClose={onClose} title="Change profile picture" maxWidth={420}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.avatarSection}>
                    <button
                        type="button"
                        className={styles.avatarPicker}
                        onClick={handlePickFile}
                        disabled={uploading || loading}
                        aria-label="Choose profile picture"
                    >
                        {profilePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profilePreview} alt="Profile preview" className={styles.avatarImage} />
                        ) : existingPic ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={existingPic} alt="Current profile" className={styles.avatarImage} />
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
                            className={styles.removeBtn}
                            onClick={handleRemoveFile}
                            disabled={uploading || loading}
                        >
                            <RiCloseLine /> Remove
                        </button>
                    ) : (
                        <span className={styles.hint}>Click the avatar to pick a new image</span>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        onChange={handleFileChange}
                    />
                </div>

                {error && <p className={styles.errorText}>{error}</p>}

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={uploading || loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={uploading || loading || !profileFile}
                    >
                        {uploading ? "Uploading picture..." : loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ChangeProfilePicModal;
