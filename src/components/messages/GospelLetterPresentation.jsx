'use client';

import React, { useRef, useEffect, useState } from 'react'; // Consolidated React imports
import { AnimatePresence, motion } from 'framer-motion';

// Components - Core
import FloatingMediaControls from '../sermon/FloatingMediaControls';

// Components - Presentation
import { PresentationShell } from '../presentation/PresentationShell';
import { PresentationHeader } from '../presentation/PresentationHeader';
import { PresentationBody } from '../presentation/PresentationBody';
import { PresentationSummary } from '../presentation/PresentationSummary';
import { PresentationFooter } from '../presentation/PresentationFooter';
import { RightPanelController } from '../presentation/RightPanelController';

// Contract: fixed header is 80px (HEADER_HEIGHT_PX). Scroll areas use 100vh-80px.
import { useSnapScrollController } from '../../hooks/scroll/useSnapScrollController';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import NotionRenderer from '../sermon/NotionRenderer';
import { renderVerseWithStyledFirstWord, renderVerseReference } from '../../lib/utils/textUtils';
import Image from 'next/image';

// Hooks & Utils
import {
    HEADER_HEIGHT_PX,
    SCROLL_AREA_HEIGHT_STYLE,
    SCROLL_PADDING_TOP_STYLE
} from '../../lib/layout-metrics';

// Contract: fixed header is 80px (HEADER_HEIGHT_PX). Scroll areas use 100vh-80px.
// import { useSnapScrollController } from '../../hooks/scroll/useSnapScrollController';
// import { useFontScale } from '../../hooks/sermon/useFontScale';
// import { renderVerseWithStyledFirstWord } from '../../lib/utils/textUtils';
// import {
//     SCROLL_COOLDOWN_MS,
//     SCROLL_THRESHOLD_DELTA,
//     SCROLL_TRIGGER_MARGIN
// } from '../sermon/constants';



const GospelLetterPresentation = ({ letter, messagesSummary, children }) => {
    // Shared Resources
    const footerRef = useRef(null);
    const sentinelRef = useRef(null);
    const [activeSection, setActiveSection] = useState('reading');

    // Hook: Snap Controller
    const { scrollRef, scrollToSection, registerSection } = useSnapScrollController();

    // Gesture Gating & Locking Refs
    const isAutoScrollingRef = useRef(false);
    const lastSnapTsRef = useRef(0);
    const wheelAccumRef = useRef(0);

    // Constants
    const SCROLL_COOLDOWN_MS = 1000;
    const SCROLL_THRESHOLD_DELTA = 30; // Min wheel delta to trigger
    const SCROLL_TRIGGER_MARGIN = '0px';

    // Font Scale Logic
    const {
        fontScale,
        toggleFontScale,
        bodyTextClass,
        verseTextClass,
        desktopBodyClass,
        desktopVerseClass // Unused currently in simpler setup but available
    } = useFontScale();

    // Data Extraction
    const { title, content, scriptureTags } = letter;

    // Helper: Smooth Scroll & Lock
    const performSnap = (targetKey, targetSectionState) => {
        if (!scrollRef.current) return;

        // 1. Lock immediately
        isAutoScrollingRef.current = true;
        lastSnapTsRef.current = Date.now();
        wheelAccumRef.current = 0; // Reset accumulator

        // 2. Set State
        setActiveSection(targetSectionState);

        // 3. Execute Scroll via Hook
        if (targetSectionState === 'letter_end') {
            // SNAP TO CENTER: Align the "End of Text" to the center of the viewport
            const containerHeight = scrollRef.current.clientHeight;
            // Target is 'letter_end' (registered ref)
            // Offset logic: -(containerHeight / 1.2)
            scrollToSection('letter_end', 'smooth', -(containerHeight / 1.2));
        } else {
            // Standard Snap to Top
            scrollToSection(targetKey, 'smooth');
        }

        // 4. Unlock after cooldown
        setTimeout(() => {
            isAutoScrollingRef.current = false;
            wheelAccumRef.current = 0; // Ensure clean slate
        }, SCROLL_COOLDOWN_MS);
    };

    // 1. Sentinel Logic (Letter End Detection)
    const isLetterEndVisible = useRef(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(([entry]) => {
            isLetterEndVisible.current = entry.isIntersecting;
        }, { rootMargin: '0px', threshold: 0.1 });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    // 2. Wheel Controller (Robust One-Gesture-One-Action)
    const handleWheel = (e) => {
        // A. Filter invalid events
        if (Math.abs(e.deltaY) < 5) return; // micro-scrolls
        if (e.ctrlKey) return; // Zoom gestures

        // B. Check Locks
        const now = Date.now();
        const timeSinceSnap = now - lastSnapTsRef.current;

        // Cooldown Lock
        if (isAutoScrollingRef.current || timeSinceSnap < SCROLL_COOLDOWN_MS) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // C. Accumulate Delta (Debounce noise)
        wheelAccumRef.current += e.deltaY;

        // D. Trigger Threshold Check
        if (Math.abs(wheelAccumRef.current) > SCROLL_THRESHOLD_DELTA) {

            // Determine Direction
            const isScrollingDown = wheelAccumRef.current > 0;
            const isScrollingUp = wheelAccumRef.current < 0;

            // Reset accum immediately so we don't trigger twice
            wheelAccumRef.current = 0;

            // E. State Machine Transitions

            // 1. Reading -> Letter End (Hold)
            if (activeSection === 'reading' && isScrollingDown) {
                if (isLetterEndVisible.current) {
                    e.preventDefault();
                    performSnap('letter_end', 'letter_end');
                }
                // Else allow native scroll
            }

            // 2. Letter End -> Summary
            else if (activeSection === 'letter_end' && isScrollingDown) {
                e.preventDefault();
                performSnap('summary', 'summary');
            }

            // 3. Summary -> Footer
            else if (activeSection === 'summary' && isScrollingDown) {
                e.preventDefault();
                performSnap('footer', 'footer');
            }

            // 4. Footer -> Summary
            else if (activeSection === 'footer' && isScrollingUp) {
                e.preventDefault();
                performSnap('summary', 'summary');
            }

            // 5. Summary -> Letter End
            else if (activeSection === 'summary' && isScrollingUp) {
                e.preventDefault();
                performSnap('letter_end', 'letter_end');
            }

            // 6. Letter End -> Reading (Unlock/Scroll Up)
            else if (activeSection === 'letter_end' && isScrollingUp) {
                // Unlock and scroll up naturally
                setActiveSection('reading');
                // No snap needed, just let native scroll happen
            }
            // Footer -> Down (Block)
            else if (activeSection === 'footer' && isScrollingDown) {
                e.preventDefault();
            }
        }
    };

    // Attach Wheel Listener Non-Passively to prevent Default
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [activeSection]); // Re-bind when state changes (required for closure to see new activeSection)


    // ------------------------------------------------------------------
    // Render Variables
    // ------------------------------------------------------------------

    // Mobile Layout Block (Kept Inline for now per plan, can be extracted later)
    const MobileLayout = (
        <div className="relative w-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-[#F4F3EF]/95 backdrop-blur-sm border-b border-[#2A4458]/10 px-6 py-4 flex justify-between items-center">
                <span className="text-[#2A4458] font-yisunshin font-bold text-xl truncate pr-4">
                    {title}
                </span>

                {/* Mobile Font Toggle */}
                <button
                    onClick={toggleFontScale}
                    className="p-2 -mr-2 text-[#2A4458] opacity-80 active:opacity-100"
                >
                    <span className="font-serif italic text-lg pr-1">A</span>
                    <span className="font-serif text-sm">A</span>
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-12 pb-32">
                <div className={bodyTextClass}>
                    {content.map(block => (
                        <div key={block.id} className="mb-4">
                            <NotionRenderer block={block} />
                        </div>
                    ))}

                    {/* Symbol Divider */}
                    <div className="flex justify-center my-16 opacity-80">
                        <div className="relative w-4 h-4">
                            <Image
                                src="/assets/symbol.png"
                                alt="Gospel Church Symbol"
                                fill
                                sizes="32px"
                                unoptimized
                                className="object-contain opacity-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Scripture Panel (Static list at bottom of letter) */}
                {scriptureTags && scriptureTags.length > 0 && (
                    <div className="border-t border-[#2A4458]/10 pt-12 mt-12 space-y-8">
                        {scriptureTags.map((tag, idx) => (
                            <div key={idx} className="bg-[#F4F3EF]">
                                <p className={verseTextClass}>
                                    {renderVerseWithStyledFirstWord(tag.text)}
                                </p>
                                <p className="text-sm text-[#2A4458] font-bold text-right font-pretendard mt-4">
                                    {tag.reference}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="shrink-0 bg-[#F4F3EF] border-t border-[#2A4458]/10 relative z-50">
                <div ref={footerRef}>
                    {children}
                </div>
            </footer>
        </div>
    );


    return (
        <>
            <PresentationShell
                scrollRef={scrollRef}
                mobileContent={MobileLayout}
                usePadding={true}
                snapMode="snap-mandatory"
                rightPanel={
                    <RightPanelController
                        isVisible={activeSection === 'reading' || activeSection === 'letter_end'}
                        mode="scripture"
                        data={scriptureTags}
                        title={title}
                    />
                }
            >
                {/* 1. Reading Section (Letter) */}
                <section
                    id="reading-section"
                    ref={el => registerSection('reading', el)}
                    className="relative min-h-[calc(100vh-80px)] snap-start"
                >
                    {/* Sticky Container Wrapper (Matches AboutPresentation structure) */}
                    <div className="sticky top-0 h-[calc(100vh-80px)] w-full pointer-events-none z-10">
                        {/* Sticky Number (Reverted to 384px as requested) */}
                        <div className={`hidden min-[1650px]:flex absolute left-12 overflow-hidden h-[72px] w-[90px] items-start transition-opacity duration-300 z-50 pointer-events-none ${activeSection !== 'reading' ? 'opacity-0' : 'opacity-100'}`}
                            style={{ top: '384px' }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key="01"
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '-100%' }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-7xl font-bold font-yisunshin text-[#2A4458] block leading-none"
                                >
                                    01
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Content Body (Relative Sibling) */}
                    {/* -mt-[calc(100vh-80px)] pulls the content up to overlap the sticky container, 
                        replicating the AboutPresentation architecture. */}
                    <div className="relative z-20 -mt-[calc(100vh-80px)]">
                        {/* Title: Lowered by 80px (pt-24/96 -> pt-[176px]) */}
                        <PresentationHeader title={title} paddingTop="pt-[176px]" />

                        {/* Body: Lowered by 80px (pt-96/384 -> pt-[464px]) */}
                        <PresentationBody
                            content={content}
                            bodyClass={desktopBodyClass}
                            endRef={el => registerSection('letter_end', el)}
                            paddingTop="pt-[464px]"
                        />
                    </div>
                </section>

                {/* Sentinel (Trigger for Summary) */}
                <div
                    ref={sentinelRef}
                    className="h-px w-full pointer-events-none opacity-0"
                />

                {/* 2. Summary Section */}
                <PresentationSummary
                    data={messagesSummary}
                    sectionRef={el => registerSection('summary', el)}
                />

                {/* 3. Footer Section */}
                <PresentationFooter
                    sectionRef={el => { registerSection('footer', el); footerRef.current = el; }}
                >
                    {children}
                </PresentationFooter>

            </PresentationShell>

            {/* Floating Controls (Desktop & Mobile) */}
            <FloatingMediaControls
                footerRef={footerRef}
                fontScale={fontScale}
                onToggleFontScale={toggleFontScale}
                shareTitle={title}
            />
        </>
    );
};

export default GospelLetterPresentation;
