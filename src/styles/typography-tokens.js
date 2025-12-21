/**
 * Typography Tokens
 * 
 * Existing: Mapping of current styles (as used in the project)
 * New: Proposed fluid typography using clamp() and cleaner pairings
 * 
 * Fonts: Montserrat / YiSunShin / Pretendard
 */

export const typographyTokens = {
    // Existing Styles (Accurate mappings from constants.js and components)
    existing: {
        heroTitle: 'font-korean text-7xl font-bold leading-none',
        pageTitle: 'font-korean font-bold text-4xl md:text-5xl lg:text-6xl leading-tight',
        sectionTitle: 'font-english text-sm font-bold tracking-widest uppercase',
        sectionNumber: 'font-korean text-7xl font-bold',
        body: 'font-korean text-base sm:text-lg md:text-lg leading-relaxed text-gray-600 font-light',
        bodySmall: 'font-korean text-sm px-1 leading-relaxed opacity-60 font-light',
        caption: 'font-korean text-[0.85em] opacity-60 italic',
        tag: 'font-english text-xs font-bold uppercase tracking-wider',
        nav: 'font-english text-sm font-semibold tracking-wide',
        buttonLabel: 'font-english text-sm font-bold',
        verse: 'font-korean text-lg leading-relaxed text-gray-600 font-light',
        reference: 'font-bold text-[0.85em] text-[#2A4458]',
    },

    // New Proposed Styles
    new: {
        heroTitle: 'font-korean font-bold leading-tight text-[clamp(3.5rem,8vw+1rem,5rem)]',
        pageTitle: 'font-korean font-bold leading-tight text-[clamp(2.5rem,6vw+1rem,4rem)]',
        sectionTitle: 'font-english font-bold tracking-[0.2em] uppercase text-[clamp(0.75rem,0.2vw+0.7rem,0.875rem)]',
        sectionNumber: 'font-korean font-bold text-[clamp(4rem,10vw,6rem)] opacity-30',
        body: 'font-mono leading-[1.7] break-keep text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] text-gray-700 font-normal',
        bodySmall: 'font-mono leading-[1.6] text-[clamp(0.875rem,0.3vw+0.8rem,1rem)] text-gray-500 font-normal',
        caption: 'font-mono opacity-70 text-[clamp(0.75rem,0.1vw+0.7rem,0.8125rem)] text-gray-500 font-light',
        tag: 'font-english font-extrabold uppercase tracking-widest text-[0.7rem] text-[#2A4458]',
        nav: 'font-english font-bold tracking-tight text-[clamp(0.875rem,0.1vw+0.85rem,0.9375rem)]',
        buttonLabel: 'font-english font-black uppercase tracking-tighter text-[0.9rem]',
        verse: 'font-korean font-light leading-relaxed text-[clamp(1.5rem,2vw+1rem,2rem)] text-[#2A4458]',
        reference: 'font-mono font-semibold text-[0.8em] text-[#5F94BD]',
    }
};
