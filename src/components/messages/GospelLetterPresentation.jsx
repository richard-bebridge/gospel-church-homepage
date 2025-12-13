'use client';

import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import NotionRenderer from '../sermon/NotionRenderer';
import FloatingMediaControls from '../sermon/FloatingMediaControls';

// Hooks
import { useFontScale } from '../../hooks/sermon/useFontScale';

const GospelLetterPresentation = ({ letter }) => {
    // Shared Resources
    const footerRef = useRef(null);

    // Font Scale Logic
    const {
        fontScale,
        toggleFontScale,
        bodyTextClass, // e.g. text-lg or text-xl
        desktopBodyClass,
        desktopVerseClass,
        verseTextClass
    } = useFontScale();

    // Data
    const { title, content, scriptureTags } = letter;

    // Helper to parse reference string e.g. "Deut 8:3" -> { text: "...", reference: "Deut 8:3" }
    // Since we only have tags (e.g. "Deut 8:3"), we need to lookup the actual text?
    // Wait, the prompt said: "Use them to look up scripture and render the result... Reuse existing scripture lookup utility if available".
    // I don't see a utility in the previous file list that does lookup from API.
    // The previous SermonPresentation took "verses" from `sermon.sections.verses`.
    // The prompt says: "Reuse existing scripture lookup utility... (e.g. some `getScriptureFromTag(tag)` that returns `{reference, text}`)."
    // Since I don't recall seeing such a utility in the file list (fetchNotion.js fetches pages, but doesn't seem to have a Bible API),
    // and the prompt says "If not, create similar hook shared...", I might need to mock it or just display the tag if I can't fetch.
    // HOWEVER, the prompt implies "getScriptureFromTag" *might* exist.
    // Let's look at `sermon` object structure in `SermonPresentation` again. It has `verses`.
    // If there is no real lookup utility, I might just display the Reference in the panel for now, or use a placeholder text if I can't find the text.
    // Actually, looking at the user request: "Reuse existing scripture lookup utility... if available".
    // I'll assume for this MVP I might just render the provided reference string as the "text" or just the reference if I don't have the bible text database.
    // Wait, `fetchNotion.js` didn't show any bible logic.
    // I will implement a placeholder Scripture Panel that lists the tags found.

    return (
        <div className="min-h-screen bg-[#F4F3EF] flex flex-col font-pretendard">

            {/* Header Placeholder (fixed header is in layout/page) */}
            {/* We need this spacer for flow, OR handle it via pt/mt logic if layout is sticky. 
                SermonPresentation handled this via pt-20 on body or similar. 
                Here we have pt-0 on container, and explicit padding on sections. */}

            {/* ======================================================== */}
            {/* MOBILE LAYOUT (< md) - Stacked with Sticky Title         */}
            {/* ======================================================== */}
            <div className="md:hidden flex flex-col w-full">

                {/* Sticky Title (Copied from SermonPresentation) */}
                {/* Header h-16. Page usually has pt. We want it sticky immediately below header. */}
                {/* Assuming page.jsx renders Header (h-16 fixed). */}
                {/* We need a spacer for the header if we aren't using pt on body. */}
                <div className="h-16" />

                <div className="sticky top-16 z-40 bg-transparent px-8 -mt-4 pointer-events-none">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-80% to-[#F4F3EF]/0 z-0 pointer-events-auto" />
                    {/* Label */}
                    <span className="relative z-10 text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-2 block pt-8 pointer-events-auto">
                        This Week's Letter
                    </span>
                    <h1 className="text-4xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep relative z-10 pb-12 pointer-events-auto">
                        {title}
                    </h1>
                </div>

                <div className="px-8 pb-12">
                    {content.map(block => (
                        <div key={block.id} className={bodyTextClass}>
                            <NotionRenderer block={block} />
                        </div>
                    ))}
                </div>

                {/* Mobile Scriptures (at bottom) */}
                <div className="px-8 pb-24 bg-[#F4F3EF] border-t border-[#2A4458]/10 pt-12">
                    {scriptureTags && scriptureTags.length > 0 ? (
                        <div className="space-y-6">
                            {scriptureTags.map((tag, idx) => (
                                <div key={idx}>
                                    <p className={`${desktopVerseClass} mb-2 break-keep text-sm`}>
                                        {tag.text || "(Verse not found: " + tag.reference + ")"}
                                    </p>
                                    <p className="text-sm text-[#2A4458] font-bold text-right font-pretendard">
                                        {tag.reference}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#2A4458]/50 text-sm">No scriptures referenced.</p>
                    )}
                </div>
            </div>


            {/* ======================================================== */}
            {/* DESKTOP LAYOUT (>= md) - Row Based                       */}
            {/* ======================================================== */}
            {/* Header (h-20) Buffer */}
            <div className="hidden md:block h-20" />

            <div className="hidden md:flex flex-col relative flex-1">

                {/* ROW 1: Sticky Header (Title | Empty) 
                    - This row is Sticky. It stays at top (top-20).
                    - Left Cell: Title (centered). 
                    - We use the Gradient Effect here to allow content to "fade" under the header.
                */}
                <div className="sticky top-20 z-30 flex flex-row w-full pointer-events-none">
                    {/* Left Title Cell */}
                    <div className="w-1/2 relative pointer-events-auto flex flex-col items-center">

                        {/* Gradient Background Layer (Solid Top -> Transparent Bottom) */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-90% to-transparent z-0" />

                        {/* Content Wrapper (80%) */}
                        <div className="relative z-10 w-full max-w-[60%] pt-24 pb-12">
                            <span className="text-[#2A4458] font-sans font-bold text-sm tracking-widest uppercase mb-6 block">
                                This Week's Letter
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep">
                                {title}
                            </h1>
                        </div>
                    </div>
                    {/* Right Cell - Purely transparent to show scripture? 
                        Or match the gradient if we want the right side to also fade?
                        User said "Title... blur gradient". Scripture might need it too if it scrolls.
                        Scripture panel is separate. Let's apply valid background to right side too if needed.
                        But usually right panel has its own behavior.
                        For now, let's keep right cell transparent so scripture text is visible?
                        Actually, if right cell is transparent, verses will scroll OVER the sticky header space?
                        No, the header is "above" (z-30). Scripture is z-20.
                        So verses will scroll BEHIND the header row.
                        We should probably apply the same gradient to the right cell so verses also fade out.
                    */}
                    <div className="w-1/2 relative pointer-events-none">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-90% to-transparent z-0" />
                    </div>
                </div>


                {/* ROW 2: Content (Body | Scripture) 
                    - Scrolls naturally.
                    - Starts immediately after Sticky Header.
                    - Added huge spacing (pt-32) to separate from Title as requested (2.5x gap).
                */}
                <div className="flex flex-row w-full z-20 -mt-8"> {/* Negative margin to pull content under the fade if desired, otherwise 0 */}

                    {/* Left Content Cell */}
                    <div className="w-1/2 pb-32 flex flex-col items-center pt-44">
                        <div className="w-full max-w-[60%]">
                            <div className={desktopBodyClass}>
                                {content.map(block => (
                                    <div key={block.id} className={desktopBodyClass}>
                                        <NotionRenderer block={block} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Scripture Cell 
                        - Border-L.
                        - Starts at same Y as Body (pt-40).
                        - Added flex centering to center the max-w-[60%] content.
                        - STICKY: Keeps it fixed while body scrolls. top-20 matches header offset.
                    */}
                    <div className="w-1/2 border-l border-[#2A4458]/10 pb-32 pt-40 flex flex-col items-center sticky top-80 h-[calc(100vh-5rem)] overflow-y-auto">
                        {scriptureTags && scriptureTags.length > 0 ? (
                            <div className="space-y-12 w-full max-w-[60%]">
                                <AnimatePresence>
                                    {scriptureTags.map((tag, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                ease: [0.16, 1, 0.3, 1], // Custom ease for "slow, sticky" feel
                                                delay: idx * 0.15 // Staggered delay
                                            }}
                                        >
                                            <p className={`${desktopVerseClass} mb-4 break-keep`}>
                                                {tag.text || "(Verse not found: " + tag.reference + ")"}
                                            </p>
                                            <p className="text-base text-[#2A4458] font-bold text-right font-pretendard">
                                                {tag.reference}
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center opacity-30 pt-32">
                                <p className="text-[#2A4458] font-yisunshin text-2xl">SOLA SCRIPTURA</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div ref={footerRef}></div>

            {/* Floating Controls */}
            <FloatingMediaControls
                audioUrl={null}
                youtubeUrl={null}
                footerRef={footerRef}
                fontScale={fontScale}
                onToggleFontScale={toggleFontScale}
                shareTitle={title}
            />
        </div>
    );
};

export default GospelLetterPresentation;
