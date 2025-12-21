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
import VerseList from '../presentation/VerseList';

// Contract: fixed header is 80px (HEADER_HEIGHT_PX). Scroll areas use 100vh-80px.
import { useSnapScrollController } from '../../hooks/scroll/useSnapScrollController';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import NotionRenderer from '../sermon/NotionRenderer';
import Image from 'next/image';

// Hooks & Utils
import {
    HEADER_HEIGHT_PX,
} from '../../lib/layout-metrics';

// Snapping position for the "Finis" divider (portion of the viewport height)
const LETTER_END_SNAP_Y_FACTOR = 0.2;

const GospelLetterPresentation = ({ letter, messagesSummary, children }) => {
    // Shared Resources
    const footerRef = useRef(null);
    const [letterEndSnapMargin, setLetterEndSnapMargin] = useState(0);

    // Hook: Snap Controller
    const {
        scrollRef,
        registerSection,
        activeSection: observedSection = 'reading'
    } = useSnapScrollController({
        initialSection: 'reading',
        // Decisive section detection (consistent with Sermon page logic)
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
    });

    const activeSection = observedSection || 'reading';
    const isReading = activeSection === 'reading';

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
    const { title, content, scriptureTags, author } = letter;

    // Compute snap offset for the letter-end divider so it floats slightly below the top edge.
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateSnapMargin = () => {
            const availableHeight = Math.max(0, window.innerHeight - HEADER_HEIGHT_PX);
            setLetterEndSnapMargin(availableHeight * LETTER_END_SNAP_Y_FACTOR);
        };

        updateSnapMargin();
        window.addEventListener('resize', updateSnapMargin);
        return () => window.removeEventListener('resize', updateSnapMargin);
    }, []);



    // ------------------------------------------------------------------
    // Render Variables
    // ------------------------------------------------------------------

    // Mobile Layout Block (Kept Inline for now per plan, can be extracted later)
    const MobileLayout = (
        <div className="relative w-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-[#F4F3EF]/95 backdrop-blur-sm border-b border-[#2A4458]/10 px-6 py-4 flex justify-between items-center">
                <span className="text-[#2A4458] font-korean font-bold text-xl truncate pr-4">
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
                    <div className="border-t border-[#2A4458]/10 pt-12 mt-12">
                        <VerseList
                            verses={scriptureTags}
                            uniqueKey={`mobile-letter-${letter.id}`}
                            containerClassName="space-y-8"
                            verseClassName={verseTextClass}
                            referenceClassName="text-sm text-[#2A4458] font-bold text-right font-mono mt-4"
                            animate={false}
                        />
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
                        isVisible={isReading}
                        mode="scripture"
                        data={isReading ? scriptureTags : []}
                        title={title}
                        uniqueKey={activeSection}
                    />
                }
            >
                {/* 1. Reading Section (Letter) */}
                <section
                    id="reading-section"
                    ref={el => registerSection('reading', el)}
                    className="relative min-h-[calc(100vh-80px)] snap-start snap-always"
                >
                    {/* Sticky Container Wrapper (Matches AboutPresentation structure) */}
                    <div className="sticky top-0 h-[calc(100vh-80px)] w-full pointer-events-none z-30">
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
                                    className="text-7xl font-bold font-korean text-[#2A4458] block leading-none"
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
                        {/* Title: Standard (96px) */}
                        <PresentationHeader title={title} paddingTop="pt-[96px]" />

                        {/* Body: Standard (384px) */}
                        <PresentationBody
                            content={content}
                            bodyClass={desktopBodyClass}
                            paddingTop="pt-[384px]"
                        >
                            {/* Author Signature */}
                            {author && (
                                <div className="w-full flex justify-end mt-16">
                                    <p className="text-xl font-bold tracking-tight text-[#2A4458] font-korean">
                                        {author}
                                    </p>
                                </div>
                            )}
                        </PresentationBody>
                    </div>
                </section>

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
