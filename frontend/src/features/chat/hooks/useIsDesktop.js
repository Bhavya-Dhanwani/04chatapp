"use client";

// Importing hooks from react
import { useEffect, useState } from "react";

// Custom hook to track whether the viewport width is at least the given breakpoint
export function useIsDesktop(breakpoint = 900) {

    // Defaulting to false so server-render matches the mobile shell and we avoid hydration mismatches
    const [isDesktop, setIsDesktop] = useState(false);

    // Effect subscribing to viewport width changes via matchMedia
    useEffect(() => {

        // Building the matchMedia query
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

        // Handler that updates the local state when the media query result changes
        const updateMatch = () => setIsDesktop(mediaQuery.matches);

        // Setting the initial value once the component is mounted in the browser
        updateMatch();

        // Subscribing to subsequent changes
        mediaQuery.addEventListener("change", updateMatch);

        // Cleanup function to remove the listener on unmount
        return () => mediaQuery.removeEventListener("change", updateMatch);
    }, [breakpoint]);

    return isDesktop;
}
