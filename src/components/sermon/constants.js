'use client';

import { CURRENT_TEXT } from '../../lib/typography-tokens';

// Helper to scale up token for 'large' mode (simple replacement for now)
const makeLarge = (tokenClass) => {
    // Replace typical size classes with larger ones manually, or just append 'text-xl' to override cascade
    return `${tokenClass} !text-xl !leading-loose`;
};

// Font Classes based on Scale
export const bodyTextClasses = {
    normal: `${CURRENT_TEXT.body_ko_default} space-y-6 mb-12 whitespace-pre-wrap`,
    large: `${makeLarge(CURRENT_TEXT.body_ko_default)} space-y-8 mb-12 whitespace-pre-wrap`
};

export const verseTextClasses = {
    normal: `${CURRENT_TEXT.verse_text} mb-2`,
    large: `${makeLarge(CURRENT_TEXT.verse_text)} mb-3`
};

export const desktopBodyClasses = {
    normal: `${CURRENT_TEXT.body_ko_default} whitespace-pre-wrap`,
    large: `${makeLarge(CURRENT_TEXT.body_ko_default)} whitespace-pre-wrap`
};

export const desktopVerseClasses = {
    // Note: Desktop VerseList adds mb-4 externally
    normal: `${CURRENT_TEXT.verse_text}`,
    large: `${makeLarge(CURRENT_TEXT.verse_text)}`
};

// Layout
export const HEADER_HEIGHT = 80;

// Gospel Letter Scroll Logic
export const SCROLL_COOLDOWN_MS = 600;
export const SCROLL_THRESHOLD_DELTA = 80;
export const SCROLL_TRIGGER_MARGIN = '0px 0px 50% 0px'; // Triggers when breathing space enters
