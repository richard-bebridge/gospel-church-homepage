/**
 * Font Loader Utility
 * Synchronizes font readiness across the application.
 */

// Simple global cache to avoid redundant checks across component mounts
let fontCache = new Set();

/**
 * Synchronously checks if all specified font specs are already in the cache.
 * Useful for setting initial state in components to avoid Flash of Unstyled Text.
 */
export const checkFontsReadySync = (specs) => {
    if (typeof window === 'undefined') return false;
    return specs.every(spec => fontCache.has(spec));
};

export const waitForFonts = async (specs) => {
    if (typeof window === 'undefined') return true;

    // Check if ALL specs are in cache
    if (checkFontsReadySync(specs)) return true;

    // Filter out already validated fonts
    const pendingSpecs = specs.filter(s => !fontCache.has(s));
    if (pendingSpecs.length === 0) return true;

    try {
        // 1. Wait for document fonts to be ready (general)
        await document.fonts.ready;

        // 2. Load and check specific fonts (explicit)
        await Promise.all(pendingSpecs.map(spec => document.fonts.load(spec)));

        // 3. Update cache
        pendingSpecs.forEach(spec => fontCache.add(spec));
        return true;
    } catch (error) {
        console.error("[fontLoader] Error loading fonts:", error);
        return false;
    }
};
