import React from 'react';

/**
 * VerticalDivider
 * 
 * Centralized component for the vertical divider line used in Presentation layouts.
 * Adjust settings here to affect About, Visit, Messages, and Letter pages globally.
 */
export const VerticalDivider = ({
    className = "",
    // Default: Center vertically in the container.
    // Note: Parent containers might be full screen (h-screen) or content area only (h-[calc(100vh-80px)]).
    // If parent is h-screen, use top-[calc(50%+40px)] to account for header.
    // If parent is content-only (starts after header), use top-1/2.
    isFullScreenParent = false
}) => {
    // Configuration
    const HEADER_OFFSET = "40px"; // Half of 80px header to push center down
    const HEIGHT = "h-[60vh]";
    const WIDTH = "w-[0.5px]"; // 1px
    const COLOR = "bg-[#05121C]";
    const OPACITY = "opacity-40";

    const positionClass = isFullScreenParent
        ? `top-[calc(50%+${HEADER_OFFSET})]`
        : "top-1/2";

    return (
        <div
            className={`absolute right-0 ${positionClass} -translate-y-1/2 ${HEIGHT} ${WIDTH} ${COLOR} ${OPACITY} pointer-events-none ${className}`}
        />
    );
};
