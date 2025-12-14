'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components

import MessagesSummarySection from '../messages/MessagesSummarySection';
import NotionRenderer from '../sermon/NotionRenderer';
import FloatingMediaControls from '../sermon/FloatingMediaControls';

// Hooks
import { useFontScale } from '../../hooks/sermon/useFontScale';

const renderVerseWithStyledFirstWord = (text) => {
    if (!text) return null;
    const parts = text.split(' ');
    const first = parts[0];
    const rest = parts.slice(1).join(' ');
    return (
        <>
            <span className="font-medium text-[1.6em]">{first}</span>{' '}{rest}
        </>
    );
};

const GospelLetterPresentation = ({ letter, messagesSummary, children }) => {
    // Shared Resources
    const footerRef = useRef(null);
    const letterRef = useRef(null);
    const summaryRef = useRef(null);
    const sentinelRef = useRef(null);
    const scrollRef = useRef(null);

    // State Machine: 'letter' | 'summary' | 'footer'
    const [activeSection, setActiveSection] = React.useState('letter');

    // Gesture Gating & Locking Refs
    const isAutoScrollingRef = useRef(false);
    const wheelAccumRef = useRef(0);
    const lastSnapTsRef = useRef(0);

    // Constants
    const COOLDOWN_MS = 600;
    const THRESHOLD_DELTA = 80; // requires intentional scroll

    // Font Scale Logic
    const {
        fontScale,
        toggleFontScale,
        bodyTextClass,
        desktopBodyClass,
        desktopVerseClass
    } = useFontScale();

    // Data
    const { title, content, scriptureTags } = letter;

    // Helper: Smooth Scroll & Lock
    const performSnap = (targetRef, targetSection) => {
        if (!scrollRef.current || !targetRef.current) return;

        // 1. Lock immediately
        isAutoScrollingRef.current = true;
        lastSnapTsRef.current = Date.now();
        wheelAccumRef.current = 0; // Reset accumulator

        // 2. Set State
        setActiveSection(targetSection);

        // 3. Scroll
        // We use offsetTop - 0 because container has [scroll-padding-top:80px]
        // But for Summary/Footer we want them fully visible. Container relative check:
        // If container is positioned, offsetTop is relative to it.
        // Actually, if we use scrollTo(0) for letter, we should use offsetTop for others.
        // However, standard offsetTop might include the padding? 
        // Let's rely on standard offsetTop behavior.
        const top = targetSection === 'letter' ? 0 : targetRef.current.offsetTop;

        scrollRef.current.scrollTo({
            top,
            behavior: 'smooth'
        });

        // 4. Unlock after cooldown
        setTimeout(() => {
            isAutoScrollingRef.current = false;
            wheelAccumRef.current = 0; // Ensure clean slate
        }, COOLDOWN_MS);
    };

    // 1. Sentinel Logic (Letter End Detection)
    // We strictly use this to allow 0 -> 1 transition
    const isLetterEndVisible = useRef(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isLetterEndVisible.current = entry.isIntersecting;
            },
            { root: scrollRef.current, threshold: 0.1, rootMargin: '0px 0px 60% 0px' }
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. Wheel Controller (Robust One-Gesture-One-Action)
    React.useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            // A. Block if locked
            if (isAutoScrollingRef.current) {
                e.preventDefault();
                return;
            }

            // B. Accumulate Delta
            wheelAccumRef.current += e.deltaY;

            // C. Threshold Check (Gating)
            if (Math.abs(wheelAccumRef.current) < THRESHOLD_DELTA) {
                // Not enough force yet, but if we are in 'letter' section and just free-scrolling, 
                // we should NOT prevent default unless we hit boundaries.
                // Actually, for 'letter' (0), we want native scroll until we hit bottom.
                if (activeSection === 'letter' && !isLetterEndVisible.current && e.deltaY > 0) {
                    // Allow native scroll
                    return;
                }
                // For other locked sections, we consume the event to prevent jitter
                if (activeSection !== 'letter') {
                    e.preventDefault();
                }
                return;
            }

            // D. Determine Direction
            const isScrollingDown = wheelAccumRef.current > 0;
            const isScrollingUp = wheelAccumRef.current < 0;

            // E. Transitions
            // Letter (0) -> Summary (1)
            if (activeSection === 'letter' && isScrollingDown) {
                // ONLY if sentinel is visible (end of letter)
                if (isLetterEndVisible.current) {
                    e.preventDefault();
                    performSnap(summaryRef, 'summary');
                }
                // Else allow native scroll (managed by return above or default browser behavior)
            }

            // Summary (1) -> Footer (2)
            else if (activeSection === 'summary' && isScrollingDown) {
                e.preventDefault();
                performSnap(footerRef, 'footer');
            }

            // Summary (1) -> Letter (0)
            else if (activeSection === 'summary' && isScrollingUp) {
                e.preventDefault();
                performSnap(letterRef, 'letter');
            }

            // Footer (2) -> Summary (1)
            else if (activeSection === 'footer' && isScrollingUp) {
                e.preventDefault();
                performSnap(summaryRef, 'summary');
            }

            // Footer (2) -> Down (Block)
            else if (activeSection === 'footer' && isScrollingDown) {
                e.preventDefault();
            }

            // Cleanup: If we acted (or blocked), reset accumulator if we are not locked?
            // If we didn't lock (e.g. invalid move), we might want to reset to avoid stuck accumulation.
            // But if we let native scroll happen (Letter mid-scroll), we don't reset.
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        // Reset accumulator on touch end or mouse leave to prevent stale values
        const resetAccum = () => { wheelAccumRef.current = 0; };
        container.addEventListener('pointerup', resetAccum);
        container.addEventListener('mouseleave', resetAccum);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('pointerup', resetAccum);
            container.removeEventListener('mouseleave', resetAccum);
        };
    }, [activeSection]);


    // 3. Sync Fixed Panel
    const FixedScripturePanel = (
        <motion.div
            className="hidden md:flex fixed right-0 top-0 w-1/2 h-full flex-col items-center z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
                opacity: activeSection === 'letter' ? 1 : 0,
                y: activeSection === 'letter' ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Buffer (80px) matched from main layout */}
            <div className="h-20 w-full shrink-0" />

            {/* Ghost Header for Alignment (Invisible) */}
            {/* This ensures the verses start exactly where the body text starts on the left, accounting for dynamic title height */}
            <div className="w-full flex flex-col items-center pt-24 pb-12 opacity-0">
                <div className="w-full max-w-[60%]">
                    <h1 className="text-5xl md:text-6xl font-bold font-yisunshin leading-tight break-keep">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Verse Container (aligned with Body Text pt-32) */}
            <div className="w-full border-l border-[#2A4458]/10 flex flex-col items-center h-full pt-32 overflow-hidden">
                {scriptureTags && scriptureTags.length > 0 ? (
                    <div className="space-y-12 w-full max-w-[60%] pointer-events-auto">
                        <AnimatePresence>
                            {scriptureTags.map((tag, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        delay: idx * 0.3
                                    }}
                                >
                                    <p className={`${desktopVerseClass} mb-4 break-keep`}>
                                        {renderVerseWithStyledFirstWord(tag.text || "(Verse not found: " + tag.reference + ")")}
                                    </p>
                                    <p className="text-base text-[#2A4458] font-bold text-right font-pretendard">
                                        {tag.reference}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center opacity-30 -mt-32">
                        <p className="text-[#2A4458] font-yisunshin text-2xl">SOLA SCRIPTURA</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#F4F3EF] flex flex-col font-pretendard">
            {/* Header Buffer */}
            <div className="hidden md:block h-20" />

            {FixedScripturePanel}

            {/* Main Scroll Container */}
            {/* Added overscroll-behavior-y: contain to prevent bounce issues */}
            <div
                ref={scrollRef}
                className="hidden md:block relative h-[calc(100vh-80px)] overflow-y-auto no-scrollbar scroll-smooth [scroll-padding-top:80px] overscroll-contain"
            >
                {/* 1. Letter Section */}
                <section id="letter-section" ref={letterRef} className="relative min-h-[calc(100vh-80px)]">

                    {/* Sticky Header inside Letter */}
                    <div className="sticky top-0 z-30 flex flex-row w-full pointer-events-none">
                        <div className="w-1/2 relative pointer-events-auto flex flex-col items-center">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-90% to-transparent z-0" />
                            <div className="relative z-10 w-full max-w-[60%] pt-24 pb-12">
                                <h1 className="text-5xl md:text-6xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep">
                                    {title}
                                </h1>
                            </div>
                        </div>
                        <div className="w-1/2" />
                    </div>

                    {/* Body Content */}
                    <div className="flex flex-row w-full z-20">
                        <div className="w-1/2 flex flex-col items-center">
                            <div className="w-full max-w-[60%] pb-32 pt-32">
                                {content.map(block => {
                                    const isBullet = block.type === 'bulleted_list_item';
                                    const spacingClass = isBullet ? 'mb-0' : 'mb-8';

                                    return (
                                        <div key={block.id} className={`${desktopBodyClass} ${spacingClass}`}>
                                            <NotionRenderer block={block} />
                                        </div>
                                    );
                                })}
                                {/* Breathing Space Buffer */}
                                <div className="h-[50vh] w-full" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="w-1/2" />
                    </div>
                </section>

                {/* Sentinel (Trigger for Summary) */}
                <div
                    ref={sentinelRef}
                    className="h-px w-full pointer-events-none opacity-0"
                />

                {/* 3. Summary Section */}
                <section id="summary-section" ref={summaryRef} className="bg-[#F4F3EF] min-h-[calc(100vh-80px)] relative z-20 w-full">
                    {messagesSummary && (
                        <MessagesSummarySection
                            {...messagesSummary}
                            reversed={true}
                        />
                    )}
                </section>

                {/* 4. Footer Section */}
                <section id="footer-section" ref={footerRef} className="w-full relative z-30">
                    {children}
                </section>

            </div>


            {/* Mobile Layout (unchanged logic) */}
            <div className="md:hidden flex flex-col w-full">
                <div className="h-16" />
                <div className="sticky top-16 z-40 bg-transparent px-8 -mt-4 pointer-events-none">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-80% to-[#F4F3EF]/0 z-0 pointer-events-auto" />
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
                <div className="px-8 pb-24 bg-[#F4F3EF] border-t border-[#2A4458]/10 pt-12">
                    {scriptureTags && scriptureTags.length > 0 ? (
                        <div className="space-y-6">
                            {scriptureTags.map((tag, idx) => (
                                <div key={idx}>
                                    <p className={`${desktopVerseClass} mb-2 break-keep text-sm`}>
                                        {renderVerseWithStyledFirstWord(tag.text || "(Verse not found: " + tag.reference + ")")}
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
                <div className="w-full">
                    {children}
                </div>
            </div>

            <FloatingMediaControls
                audioUrl={null}
                youtubeUrl={null}
                footerRef={footerRef}
                fontScale={fontScale}
                onToggleFontScale={toggleFontScale}
                shareTitle={title}
            />
        </div >
    );
};

export default GospelLetterPresentation;
