/**
 * Typography Tokens (Internal Alpha)
 * 
 * CURRENT_TEXT: Reference exact class strings used in production today.
 * NEXT_TEXT: Proposed logical tokens using fluid typography (clamp).
 * 
 * Instructions:
 * - Use standard Tailwind utilities in CURRENT_TEXT.
 * - Use arbitrary values text-[clamp(...)] in NEXT_TEXT for size.
 * - NEXT_TEXT should maintain the same font-family and weight intent.
 */

// Production Styles (Do not change unless production code changes)
export const CURRENT_TEXT = {
    // English Display
    hero_en: "text-3xl md:text-4xl font-english font-bold uppercase tracking-widest text-[#05121C]",
    nav_en: "text-sm font-english font-bold tracking-wide uppercase",
    badge: "text-sm font-english font-bold tracking-widest uppercase",

    // Korean Display
    page_title_ko: "text-4xl md:text-5xl lg:text-6xl font-bold font-korean leading-tight break-keep",
    section_title_ko_display: "text-7xl font-bold font-korean leading-none",
    section_heading_ko: "text-2xl font-bold font-mono leading-tight break-keep",

    // Body & Content
    body_ko_default: "text-lg leading-relaxed break-keep font-light font-korean",
    body_ko_long: "text-xl leading-loose break-keep font-light font-korean",

    // Verse / Scripture (Matches body visually in current site usually, but sometimes separate)
    verse_text: "text-lg leading-relaxed break-keep font-light font-korean",

    // Footer / Utility
    footer_contact_label: "font-mono font-bold text-base",
    footer_contact_value: "font-mono font-light text-base",
};

// Proposed Tokens (Fluid Sizing)
export const NEXT_TEXT = {
    // English Display
    // Current: 30px -> 36px. Target: Fluid 30px to 42px.
    hero_en: "text-[clamp(30px,4vw,42px)] font-english font-bold uppercase tracking-widest text-[#05121C]",

    // Current: 14px fixed. Target: 14px fixed is usually fine for nav, but let's try fluid slightly.
    nav_en: "text-[clamp(13px,0.8vw+10px,15px)] font-english font-bold tracking-wide uppercase",

    // Current: 14px.
    badge: "text-[12px] font-english font-bold tracking-[0.2em] uppercase",

    // Korean Display
    // Current: 36px/48px/60px. Target: Fluid 36px to 64px.
    page_title_ko: "text-[clamp(36px,5vw+16px,64px)] font-bold font-korean leading-[1.15] break-keep",

    // Current: 72px. Target: Fluid 64px to 96px.
    section_title_ko_display: "text-[clamp(64px,8vw,96px)] font-bold font-korean leading-none",

    // Current: 24px. Target: Fluid 22px to 28px.
    section_heading_ko: "text-[clamp(22px,2vw+14px,28px)] font-bold font-mono leading-tight break-keep",

    // Body
    // Current: 18px (text-lg). Target: Fluid 16px to 19px (Conservative).
    body_ko_default: "text-[clamp(16px,0.5vw+14px,19px)] leading-relaxed break-keep font-light font-mono",

    // Current: 20px (text-xl). Target: Fluid 18px to 21px.
    body_ko_long: "text-[clamp(18px,0.5vw+16px,21px)] leading-loose break-keep font-light font-mono",

    // Verse
    verse_text: "text-[clamp(17px,0.6vw+15px,20px)] leading-relaxed break-keep font-light font-mono",

    // Footer (Usually kept static/small)
    footer_contact_label: "font-mono font-bold text-[15px]",
    footer_contact_value: "font-mono font-light text-[15px]",
};

// Helper utility
export const cx = (...classes) => classes.filter(Boolean).join(' ');
