"use client";

// Importing icons from react-icons
import {
    RiChat3Line,
    RiChat3Fill,
    RiRecordCircleLine,
    RiRecordCircleFill,
    RiPhoneLine,
    RiPhoneFill,
    RiGroupLine,
    RiGroupFill,
    RiSettings3Line,
    RiSettings3Fill,
} from "react-icons/ri";

// Importing CSS module for bottom nav styling
import styles from "../css/BottomNav.module.css";

// Definition of the bottom nav tabs (id, label, inactive icon, active icon)
const TABS = [
    { id: "chats", label: "Chats", Icon: RiChat3Line, IconActive: RiChat3Fill },
    { id: "status", label: "Status", Icon: RiRecordCircleLine, IconActive: RiRecordCircleFill },
    { id: "calls", label: "Calls", Icon: RiPhoneLine, IconActive: RiPhoneFill },
    { id: "communities", label: "Communities", Icon: RiGroupLine, IconActive: RiGroupFill },
    { id: "settings", label: "Settings", Icon: RiSettings3Line, IconActive: RiSettings3Fill },
];

// Bottom navigation component for the mobile chat shell
function BottomNav({ activeTab, onTabChange }) {

    // Rendering the nav bar with one button per tab
    return (
        <nav className={styles.nav}>
            {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                const Icon = isActive ? tab.IconActive : tab.Icon;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                        onClick={() => onTabChange(tab.id)}
                        aria-label={tab.label}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Icon className={styles.tabIcon} />
                        <span className={styles.tabLabel}>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

export default BottomNav;
