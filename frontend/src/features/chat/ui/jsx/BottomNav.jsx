"use client";

// Importing hooks from react
import { useState } from "react";

// Importing hooks from react-redux
import { useSelector } from "react-redux";

// Importing icons from react-icons
import { RiUserLine, RiAddLine } from "react-icons/ri";

// Importing the change-profile-pic modal (opened by the "+" update button)
import ChangeProfilePicModal from "../../../user/ui/jsx/ChangeProfilePicModal";

// Importing CSS module for bottom nav styling
import styles from "../css/BottomNav.module.css";

// Bottom navigation component for the mobile chat shell.
// Shows only the current user's profile picture, name, and a "+" button
// to open the change-profile-pic modal (the "updation thing").
function BottomNav() {

    // Local state to control the change-profile-pic modal
    const [pfpModalOpen, setPfpModalOpen] = useState(false);
    const [pfpModalKey, setPfpModalKey] = useState(0);

    // Getting the current user from the auth slice
    const { user } = useSelector((state) => state.auth);

    // First letter of the user's name for the avatar fallback
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

    // Display name (fallback to "You" if missing)
    const displayName = user?.name || "You";

    // Opening the profile-pic update modal (key bump resets the modal's form state)
    const openUpdateModal = () => {
        setPfpModalKey((k) => k + 1);
        setPfpModalOpen(true);
    };

    const closeUpdateModal = () => setPfpModalOpen(false);

    return (
        <>
            <nav className={styles.nav} aria-label="Your profile">
                <div className={styles.profile}>
                    <button
                        type="button"
                        className={styles.avatarBtn}
                        onClick={openUpdateModal}
                        aria-label="Update your profile picture"
                    >
                        {user?.profilePic ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profilePic} alt="" className={styles.avatarImg} />
                        ) : user?.name ? (
                            <span className={styles.avatarInitial}>{initial}</span>
                        ) : (
                            <RiUserLine className={styles.avatarPlaceholder} />
                        )}
                    </button>

                    <span className={styles.name} title={displayName}>{displayName}</span>
                </div>

                <button
                    type="button"
                    className={styles.updateBtn}
                    onClick={openUpdateModal}
                    aria-label="Update profile"
                >
                    <RiAddLine />
                </button>
            </nav>

            <ChangeProfilePicModal
                key={`bottomnav-pfp-${pfpModalKey}`}
                open={pfpModalOpen}
                onClose={closeUpdateModal}
            />
        </>
    );
}

export default BottomNav;
