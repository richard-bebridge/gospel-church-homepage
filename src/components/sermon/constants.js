'use client';

import { CURRENT_TEXT } from '../../lib/typography-tokens';

// Helper to scale up token for 'large' mode
// Using explicit pixel values to override clamp() in base tokens
const makeLarge = (tokenClass) => {
    return `${tokenClass} !text-[24px] !leading-relaxed`;
};

const makeExtraLarge = (tokenClass) => {
    return `${tokenClass} !text-[28px] !leading-relaxed`;
};

// Font Classes based on Scale
export const bodyTextClasses = {
    normal: `${CURRENT_TEXT.body_ko_default} space-y-6 mb-12 whitespace-pre-wrap`,
    large: `${makeLarge(CURRENT_TEXT.body_ko_default)} space-y-8 mb-12 whitespace-pre-wrap`,
    xl: `${makeExtraLarge(CURRENT_TEXT.body_ko_default)} space-y-10 mb-12 whitespace-pre-wrap`
};

export const verseTextClasses = {
    normal: `${CURRENT_TEXT.verse_text} mb-2`,
    large: `${makeLarge(CURRENT_TEXT.verse_text)} mb-3`,
    xl: `${makeExtraLarge(CURRENT_TEXT.verse_text)} mb-4`
};

export const desktopBodyClasses = {
    normal: `${CURRENT_TEXT.body_ko_default} whitespace-pre-wrap`,
    large: `${makeLarge(CURRENT_TEXT.body_ko_default)} whitespace-pre-wrap`,
    xl: `${makeExtraLarge(CURRENT_TEXT.body_ko_default)} whitespace-pre-wrap`
};

export const desktopVerseClasses = {
    // Note: Desktop VerseList adds mb-4 externally
    normal: `${CURRENT_TEXT.verse_text}`,
    large: `${makeLarge(CURRENT_TEXT.verse_text)}`,
    xl: `${makeExtraLarge(CURRENT_TEXT.verse_text)}`
};

// Layout
export const HEADER_HEIGHT = 80;

// Gospel Letter Scroll Logic
export const SCROLL_COOLDOWN_MS = 600;
export const SCROLL_THRESHOLD_DELTA = 80;
export const SCROLL_TRIGGER_MARGIN = '0px 0px 50% 0px'; // Triggers when breathing space enters
