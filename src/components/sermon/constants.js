'use client';

// Font Classes based on Scale
export const bodyTextClasses = {
    normal: "text-lg leading-relaxed text-gray-600 space-y-6 break-keep font-light font-korean mb-12",
    large: "text-xl leading-loose text-gray-700 space-y-8 break-keep font-light font-korean mb-12"
};

export const verseTextClasses = {
    normal: "text-lg leading-relaxed text-gray-600 break-keep font-light font-korean mb-2",
    large: "text-xl leading-loose text-gray-700 break-keep font-light font-korean mb-3"
};

export const desktopBodyClasses = {
    normal: "text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 space-y-4 sm:space-y-6 md:space-y-8 break-keep font-light font-korean",
    large: "text-base sm:text-lg md:text-xl leading-loose text-gray-700 space-y-6 sm:space-y-8 md:space-y-10 break-keep font-light font-korean"
};

export const desktopVerseClasses = {
    normal: "text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 break-keep font-light font-korean",
    large: "text-base sm:text-lg md:text-xl leading-loose text-gray-700 break-keep font-light font-korean"
};

// Layout
export const HEADER_HEIGHT = 80;

// Gospel Letter Scroll Logic
export const SCROLL_COOLDOWN_MS = 600;
export const SCROLL_THRESHOLD_DELTA = 80;
export const SCROLL_TRIGGER_MARGIN = '0px 0px 50% 0px'; // Triggers when breathing space enters
