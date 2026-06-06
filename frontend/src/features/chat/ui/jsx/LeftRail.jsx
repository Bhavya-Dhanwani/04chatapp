"use client";

// Importing hooks from react-redux
import { useSelector } from "react-redux";

// Importing next image for the brand logo
import Image from "next/image";

// Importing icons from react-icons
import {
    RiHome5Line,
    RiChat3Fill,
    RiSendPlaneLine,
    RiHeartLine,
    RiAddBoxLine,
    RiBarChartBoxLine,
    RiMenuLine,
    RiSettings3Line,
    RiUserLine,
} from "react-icons/ri";

// Importing CSS module for left rail styling
import styles from "../css/LeftRail.module.css";

// Top-section navigation items (visual scaffold; the chat app currently only has one view)
const TOP_ITEMS = [
    { id: "home", Icon: RiHome5Line, label: "Home" },
    { id: "chats", Icon: RiChat3Fill, label: "Chats", active: true, dot: true },
    { id: "send", Icon: RiSendPlaneLine, label: "Direct" },
    { id: "notifications", Icon: RiHeartLine, label: "Notifications", dot: true },
    { id: "create", Icon: RiAddBoxLine, label: "Create" },
    { id: "stats", Icon: RiBarChartBoxLine, label: "Stats" },
];

// Bottom-section utility items
const BOTTOM_ITEMS = [
    { id: "more", Icon: RiMenuLine, label: "More" },
    { id: "settings", Icon: RiSettings3Line, label: "Settings" },
];

// Left vertical icon rail shown only on the desktop layout
function LeftRail() {

    // Getting the current user for the avatar at the bottom
    const { user } = useSelector((state) => state.auth);

    // Computing first letter for the avatar fallback
    const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

    return (
        <aside className={styles.rail}>

            {/* Brand logo at the top */}
            <div className={styles.brand}>
                <Image src="/logo.png" alt="Logo" width={28} height={28} className={styles.brandLogo} />
            </div>

            {/* Top section: primary nav */}
            <div className={styles.section}>
                {TOP_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`${styles.railItem} ${item.active ? styles.railItemActive : ""}`}
                        aria-label={item.label}
                        aria-current={item.active ? "page" : undefined}
                    >
                        <item.Icon className={styles.railIcon} />
                        {item.dot && <span className={styles.railDot} />}
                    </button>
                ))}
            </div>

            {/* Spacer pushes the bottom section down */}
            <div className={styles.spacer} />

            {/* Bottom section: utilities + user avatar */}
            <div className={styles.section}>
                {BOTTOM_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={styles.railItem}
                        aria-label={item.label}
                    >
                        <item.Icon className={styles.railIcon} />
                    </button>
                ))}
                <button
                    type="button"
                    className={styles.userBtn}
                    aria-label={user?.name || "Profile"}
                >
                    <span className={styles.userAvatar}>
                        {user?.profilePic ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profilePic} alt="" className={styles.userAvatarImg} />
                        ) : user?.name ? (
                            <span className={styles.userInitial}>{initial}</span>
                        ) : (
                            <RiUserLine className={styles.userPlaceholder} />
                        )}
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default LeftRail;
