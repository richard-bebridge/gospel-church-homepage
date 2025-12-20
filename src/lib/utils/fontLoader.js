/**
 * Utility to wait for specific fonts to be fully loaded and ready in the browser.
 * This helps prevent FOUT (Flash of Unstyled Text) especially in intro/loading sequences.
 */

// Simple global cache to avoid redundant checks across component mounts
let fontCache = new Set();

export const waitForFonts = async (specs) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return true;

    // Filter out already validated fonts to skip redundant heavy checks
    const pendingSpecs = specs.filter(s => !fontCache.has(s));
    if (pendingSpecs.length === 0) return true;

    try {
        // 1. Wait for document fonts to be ready (general)
        await document.fonts.ready;

        // 2. Map specs to loading promises
        // We attempt to load them all in parallel
        await Promise.all(pendingSpecs.map(async (spec) => {
            try {
                // If it's already checked, skip load
                if (!document.fonts.check(spec)) {
                    await document.fonts.load(spec);
                }
                fontCache.add(spec);
            } catch (err) {
                console.warn(`[fontLoader] Failed to load spec: ${spec}`, err);
                // We resolve anyway to not block the app forever, 
                // but we don't add to cache so it might retry if needed.
            }
        }));

        return true;
    } catch (e) {
        console.warn('[fontLoader] Error in waitForFonts', e);
        return true; // Fallback to avoid getting stuck
    }
};

/**
 * Checks if fonts are already ready without triggering a load.
 */
export const checkFontsReady = (specs) => {
    if (typeof document === 'undefined') return true;
    return specs.every(spec => fontCache.has(spec) || document.fonts.check(spec));
};
