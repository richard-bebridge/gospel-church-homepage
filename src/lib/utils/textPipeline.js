/**
 * textPipeline.js
 * Centralized utility for Notion text processing.
 */

/**
 * Normalizes text to NFC and provides tokenization.
 * @param {string} text - The raw text to process.
 * @returns {Object} - Normalized text and tokens.
 */
export const normalizeAndTokenize = (text) => {
    const raw = text || "";
    const normalized = raw.normalize('NFC');

    // Simple sentence/token splitting for diagnostic comparison
    // This can be expanded based on specific requirements for token IDs
    const tokens = normalized
        .split(/([.!?\s]+)/)
        .filter(t => t.length > 0)
        .map((t, i) => ({
            id: `token-${i}`,
            text: t,
            isSeparator: /^[.!?\s]+$/.test(t)
        }));

    return {
        normalized,
        tokens,
        raw
    };
};

/**
 * Shorthand for simple NFC normalization.
 */
export const fastNormalize = (text) => (text || "").normalize('NFC');
