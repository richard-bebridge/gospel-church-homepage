'use client';

import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

// Components - Core
import SwipeIndicator from './sermon/SwipeIndicator';
import FloatingMediaControls from './sermon/FloatingMediaControls';
import NotionRenderer from './sermon/NotionRenderer';

// Components - Presentation
import { PresentationShell } from '../components/presentation/PresentationShell';
import { PresentationSummary } from '../components/presentation/PresentationSummary';
import { PresentationFooter } from '../components/presentation/PresentationFooter';
import { RightPanelController } from '../components/presentation/RightPanelController';

// Hooks & Metrics
import MessagesSummarySection from './messages/MessagesSummarySection';
import {
    HEADER_HEIGHT_PX,
    SCROLL_AREA_HEIGHT_STYLE
} from '../lib/layout-metrics';
import { useSnapScrollController } from '../hooks/scroll/useSnapScrollController';
// import { useDesktopObserver } from '../hooks/sermon/useDesktopObserver'; // Removed
import { useFontScale } from '../hooks/sermon/useFontScale';
import { useMobileScroll } from '../hooks/sermon/useMobileScroll';
import { useDynamicHeight, useVerseAlignment } from '../hooks/sermon/useDynamicHeight';
import { renderVerseWithStyledFirstWord } from '../lib/utils/textUtils';


const SermonPresentation = ({ sermon, children, messagesSummary, siteSettings }) => {

    // ------------------------------------------------------------------
    // Shared Resources & Hooks
    // ------------------------------------------------------------------
    const footerRef = useRef(null);

    // Font Scale Logic
    const {
        fontScale,
        toggleFontScale,
        bodyTextClass,
        verseTextClass, // Mobile uses this
        desktopBodyClass
    } = useFontScale();

    // Desktop Logic
    const {
        scrollRef,
        activeSection,
        direction,
        registerSection,
        getSectionMap
    } = useSnapScrollController({
        dependencies: [sermon.sections.length],
        rootMargin: '-20% 0px -20% 0px'
    });

    const verseAlignmentOffset = useVerseAlignment(activeSection, { current: Array.from(getSectionMap().values()) }, fontScale);

    // Mobile Logic
    const { currentMobileSection, handleHorizontalScroll } = useMobileScroll();
    const { contentHeight, sectionRefs: mobileSectionRefs } = useDynamicHeight(currentMobileSection, sermon.sections, fontScale);
    const stickyTitleRef = useRef(null);

    // Render Variables
    const currentDesktopSection = sermon.sections[activeSection] || {};
    const desktopVerses = currentDesktopSection.verses || [];

    // Animation Variants
    const desktopVariants = {
        enter: (d) => ({ y: d > 0 ? '150%' : '-150%' }),
        center: { y: 0 },
        exit: (d) => ({ y: d > 0 ? '-150%' : '150%' }),
    };


    // ------------------------------------------------------------------
    // Layout Blocks
    // ------------------------------------------------------------------

    const MobileLayout = (
        <div className="relative w-full">
            <div className="flex flex-col w-full">
                {/* A. Sticky Sermon Title */}
                <div ref={stickyTitleRef} className="sticky top-16 z-40 bg-transparent px-8 pt-4 pointer-events-none">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-80% to-[#F4F3EF]/0 z-0 pointer-events-auto" />
                    <h1 className="text-4xl font-bold font-korean text-[#05121C] leading-tight break-keep relative z-10 pb-12 pointer-events-auto line-clamp-3">
                        {sermon.title}
                    </h1>
                </div>

                {/* B. Top Navigation */}
                <div className="w-full flex justify-center py-12 relative z-10 px-8">
                    <SwipeIndicator
                        total={sermon.sections.length}
                        current={currentMobileSection}
                        idPrefix="top"
                    />
                </div>

                {/* C. Content Wrapper */}
                <div style={{ height: contentHeight }} className="overflow-hidden relative w-full">
                    <div
                        className="w-full overflow-x-auto snap-x snap-mandatory flex items-start no-scrollbar"
                        onScroll={handleHorizontalScroll}
                    >
                        {sermon.sections.map((section, index) => (
                            <article
                                key={index}
                                ref={el => mobileSectionRefs.current[index] = el}
                                className="min-w-full w-full snap-start flex flex-col"
                            >
                                <div className="px-8 py-6">
                                    {/* Section Header */}
                                    <div className="flex flex-row items-start pt-2 gap-4 mb-12">
                                        <span className="text-7xl font-bold font-korean text-[#2A4458] leading-none">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        {section.heading && (
                                            <h2 className="text-2xl font-bold text-[#05121C] font-mono leading-tight break-keep flex-1 mt-1">
                                                {section.heading}
                                            </h2>
                                        )}
                                    </div>

                                    {/* Body Text */}
                                    <div className={bodyTextClass}>
                                        {section.content.map(block => (
                                            <div key={block.id}><NotionRenderer block={block} /></div>
                                        ))}
                                    </div>

                                    {/* Symbol Divider */}
                                    <div className="flex justify-center mb-12 opacity-80">
                                        <div className="relative w-3 h-3">
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

                                    {/* Bible Verses */}
                                    <div className="space-y-8 pb-12">
                                        {section.verses?.map((verse, idx) => (
                                            <div key={idx} className="bg-transparent">
                                                <p className={verseTextClass}>
                                                    {renderVerseWithStyledFirstWord(verse.text)}
                                                </p>
                                                <p className="text-base text-[#2A4458] font-bold text-right font-mono">
                                                    {verse.reference}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* D. Bottom Navigation */}
                <div className="w-full flex justify-center py-20 relative z-10 px-8 mb-8">
                    <SwipeIndicator
                        total={sermon.sections.length}
                        current={currentMobileSection}
                        idPrefix="bottom"
                    />
                </div>

                {/* E. Footer */}
                <footer className="shrink-0 bg-[#F4F3EF] border-t border-[#2A4458]/10 relative z-50">
                    <div ref={footerRef}>
                        {children}
                    </div>
                </footer>
            </div>
        </div>
    );

    // Internal Component: Sermon Left Panel (Sticky Title)
    const SermonLeftPanel = (
        <div className="sticky top-0 w-full overflow-hidden pointer-events-none z-10">
            {/* Note: In original logic, Right Panel was also here. Now it's separate rightPanel prop. 
                 But Left Panel Title needs to stick. */}

            {/* Left Panel: Title & Number */}
            {/* Original was absolute left-0 top-0 w-1/2 h-full ... inside scroll area */}
            {/* But since we removed 'h-full' wrapper? 
                Use PresentationShell's structure. 
                We are INSIDE scroll container. 
                We need a sticky element that covers the viewport height? 
                Original: <div className="sticky top-0 w-full ...">...<div absolute left-0 w-1/2 h-full></div></div>
            */}
            <div style={SCROLL_AREA_HEIGHT_STYLE} className="absolute left-0 top-0 w-1/2 border-r border-gray-200 flex flex-col items-center pt-[var(--layout-pt-title)] pointer-events-none">
                {/* Title Fade */}
                <div className={`w-full max-w-[60%] transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-korean text-[#05121C] leading-tight break-keep line-clamp-3">
                        {sermon.title}
                    </h1>
                </div>

                {/* Number Animation */}
                <div className={`hidden min-[1450px]:flex absolute top-[384px] left-12 overflow-hidden h-[72px] w-[90px] items-start transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.span
                            key={activeSection}
                            custom={direction}
                            variants={desktopVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="text-7xl font-bold font-korean text-[#2A4458] block leading-none pt-1 absolute top-0 left-0 bg-[#F4F3EF] w-full"
                        >
                            {String(Math.min(activeSection + 1, sermon.sections.length)).padStart(2, '0')}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );


    return (
        <>
            <PresentationShell
                scrollRef={scrollRef}
                mobileContent={MobileLayout}
                snapMode="snap-mandatory"
                rightPanel={
                    <RightPanelController
                        isVisible={activeSection < sermon.sections.length}
                        mode="scripture"
                        data={desktopVerses} // Passes current section verses
                        title={sermon.title} // Used for ghost alignment
                        titleClassName="text-4xl md:text-5xl lg:text-6xl font-bold font-korean text-[#05121C] leading-tight break-keep line-clamp-3"
                        paddingTopClass="pt-[96px]"
                        contentPaddingClass="pt-[384px]"
                        uniqueKey={activeSection}
                    />
                }
            >
                <div className="relative w-full bg-[#F4F3EF]">

                    {/* 1. Sticky Left Panel Container */}
                    <div
                        style={SCROLL_AREA_HEIGHT_STYLE}
                        className="sticky top-0 w-full overflow-hidden pointer-events-none z-10"
                    >
                        {/* Note: SermonLeftPanel content extracted above usually, but here mapped inline for simplicity of context access */}
                        {/* Title: Standard (96px) */}
                        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-gray-200 flex flex-col items-center pt-[96px]">
                            <div className={`w-full max-w-[60%] transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-korean text-[#05121C] leading-tight break-keep line-clamp-3">
                                    {sermon.title}
                                </h1>
                            </div>

                            <div
                                className={`hidden min-[1450px]:flex absolute left-12 overflow-hidden h-[72px] w-[90px] items-start transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
                                style={{ top: '384px' }}
                            >
                                <AnimatePresence mode="popLayout" custom={direction}>
                                    <motion.span
                                        key={activeSection}
                                        custom={direction}
                                        variants={desktopVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="text-7xl font-bold font-korean text-[#2A4458] block leading-none pt-1 absolute top-0 left-0 bg-[#F4F3EF] w-full"
                                    >
                                        {String(Math.min(activeSection + 1, sermon.sections.length)).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* 2. Scrollable Content */}
                    <div className="relative z-20 w-full pointer-events-none">
                        <div
                            style={{ marginTop: `calc(-100vh + ${HEADER_HEIGHT_PX}px)` }}
                            className="w-1/2 relative pointer-events-auto"
                        >
                            {sermon.sections.map((section, index) => (
                                <section
                                    key={index}
                                    ref={el => registerSection(index, el)}
                                    className="min-h-[70vh] snap-start mb-24 flex flex-col items-center pt-[384px]"
                                >
                                    <div className="w-full max-w-[60%]">
                                        {section.heading && (
                                            <h2 className="text-2xl font-bold text-[#05121C] break-keep font-mono leading-tight mb-8">
                                                {section.heading}
                                            </h2>
                                        )}
                                        <div className="w-full">
                                            {section.content.map(block => {
                                                const isBullet = block.type === 'bulleted_list_item';
                                                const spacingClass = isBullet ? 'mb-0' : 'mb-8';

                                                return (
                                                    <div key={block.id} className={`${desktopBodyClass} ${spacingClass}`}>
                                                        <NotionRenderer block={block} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            ))}

                            <div className="h-[20vh] w-full shrink-0" />
                        </div>
                    </div>

                    {/* 3. Summary Section */}
                    {messagesSummary && (
                        <PresentationSummary
                            data={{ ...messagesSummary, seriesTitle: sermon.title }}
                            sectionRef={el => registerSection(sermon.sections.length, el)}
                        />
                    )}
                </div>

                {/* 4. Footer */}
                <PresentationFooter
                    sectionRef={el => { /* No specific snap for footer in Sermon? It just flows */
                        /* But wait, SermonPresentation line 337: <div ref={footerRef} ...> */
                        /* Footer is children. Just standard render. */
                    }}
                >
                    <div ref={footerRef} className="relative z-30 w-full">
                        {children}
                    </div>
                </PresentationFooter>
            </PresentationShell>


            {/* Floating Controls */}
            <FloatingMediaControls
                audioUrl={sermon.audio}
                youtubeUrl={sermon.youtube}
                footerRef={footerRef}
                fontScale={fontScale}
                onToggleFontScale={toggleFontScale}
                shareTitle={sermon.title}
            />
        </>
    );
};

export default SermonPresentation;
