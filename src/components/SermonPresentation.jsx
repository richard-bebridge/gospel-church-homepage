'use client';

import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import symbolImg from '../assets/symbol.png';

// Components
import SwipeIndicator from './sermon/SwipeIndicator';
import FloatingMediaControls from './sermon/FloatingMediaControls';
import NotionRenderer from './sermon/NotionRenderer';

// Hooks
import MessagesSummarySection from './messages/MessagesSummarySection';
import { useFontScale } from '../hooks/sermon/useFontScale';
import { useDesktopObserver } from '../hooks/sermon/useDesktopObserver';
import { useMobileScroll } from '../hooks/sermon/useMobileScroll';
import { useDynamicHeight, useVerseAlignment } from '../hooks/sermon/useDynamicHeight';

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

const SermonPresentation = ({ sermon, children, messagesSummary }) => {

    // ------------------------------------------------------------------
    // Shared Resources & Hooks
    // ------------------------------------------------------------------
    const footerRef = useRef(null);

    // Font Scale Logic
    const {
        fontScale,
        toggleFontScale,
        bodyTextClass,
        verseTextClass,
        desktopBodyClass,
        desktopVerseClass
    } = useFontScale();

    // Desktop Logic
    const { desktopState, desktopSectionsRef } = useDesktopObserver(sermon.sections.length);
    const { section: activeSection, direction: desktopDirection } = desktopState;
    const verseAlignmentOffset = useVerseAlignment(activeSection, desktopSectionsRef, fontScale);

    // Mobile Logic
    const { currentMobileSection, handleHorizontalScroll } = useMobileScroll();
    const { contentHeight, sectionRefs: mobileSectionRefs } = useDynamicHeight(currentMobileSection, sermon.sections, fontScale);
    const stickyTitleRef = useRef(null);

    // Render Variables
    const currentDesktopSection = sermon.sections[activeSection] || {};
    const desktopVerses = currentDesktopSection.verses || [];
    const desktopVariants = {
        enter: (d) => ({ y: d > 0 ? '150%' : '-150%' }),
        center: { y: 0 },
        exit: (d) => ({ y: d > 0 ? '-150%' : '150%' }),
    };

    return (
        <>
            {/* ======================================================== */}
            {/* MOBILE LAYOUT (< md)                                     */}
            {/* ======================================================== */}
            <div className="md:hidden min-h-screen bg-[#F4F3EF] flex flex-col">
                <div className="relative w-full">
                    <div className="flex flex-col w-full">

                        {/* A. Sticky Sermon Title */}
                        {/* Header is fixed h-16 (4rem). Page has pt-20 (5rem). Gap is 1rem. */}
                        {/* We use -mt-4 to pull it up 1rem so it sticks immediately at top-16 (4rem) */}
                        <div ref={stickyTitleRef} className="sticky top-16 z-40 bg-transparent px-8 pt-4 pointer-events-none">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-80% to-[#F4F3EF]/0 z-0 pointer-events-auto" />
                            {/* <span className="relative z-10 text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-2 block pt-8 pointer-events-auto">
                                THIS WEEK'S SERMON
                            </span> */}
                            <h1 className="text-4xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep relative z-10 pb-12 pointer-events-auto line-clamp-3">
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
                                                <span className="text-7xl font-bold font-yisunshin text-[#2A4458] leading-none">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                {section.heading && (
                                                    <h2 className="text-2xl font-bold text-[#05121C] font-pretendard leading-tight break-keep flex-1 mt-1">
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
                                                        src={symbolImg}
                                                        alt="Gospel Church Symbol"
                                                        fill
                                                        sizes="32px"
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
                                                        <p className="text-base text-[#2A4458] font-bold text-right font-pretendard">
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
            </div>

            {/* ======================================================== */}
            {/* DESKTOP LAYOUT (>= md)                                   */}
            {/* ======================================================== */}
            <div className="hidden md:block relative h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar font-pretendard">
                <div className="relative w-full bg-[#F4F3EF]">

                    {/* Left/Right Container */}
                    {/* Left/Right Container */}
                    <div className="sticky top-0 h-[calc(100vh-80px)] w-full overflow-hidden pointer-events-none z-10">
                        {/* Right Panel: Verses */}
                        <div className={`absolute right-0 top-0 w-1/2 h-full flex flex-col justify-start items-center pt-96 overflow-hidden z-0 transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                            <AnimatePresence mode="wait">
                                {desktopVerses.length > 0 ? (
                                    <motion.div
                                        key={activeSection}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: { staggerChildren: 0.3 }
                                            },
                                            exit: { opacity: 0, transition: { duration: 0.2 } }
                                        }}
                                        className="w-full max-w-[60%] space-y-8 pointer-events-auto"
                                        style={{ marginTop: verseAlignmentOffset }}
                                    >
                                        {desktopVerses.map((verse, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={{
                                                    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                                                    visible: {
                                                        opacity: 1,
                                                        y: 0,
                                                        filter: 'blur(0px)',
                                                        transition: { duration: 0.5, ease: "easeOut" }
                                                    }
                                                }}
                                                className="mb-12 last:mb-0"
                                            >
                                                <p className={desktopVerseClass} style={{ wordBreak: 'keep-all' }}>
                                                    {renderVerseWithStyledFirstWord(verse.text)}
                                                </p>
                                                <div className="h-4" />
                                                <p className="text-sm text-[#2A4458] font-bold text-right font-pretendard">
                                                    {verse.reference}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-gray-300 text-center pointer-events-auto"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Left Panel: Title & Number */}
                        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-gray-200 flex flex-col items-center pt-24">
                            <div className={`w-full max-w-[60%] transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                                {/* <span className="text-[#2A4458] font-sans font-bold text-sm tracking-widest uppercase mb-6 block">
                                    THIS WEEK'S SERMON
                                </span> */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep line-clamp-3">
                                    {sermon.title}
                                </h1>
                            </div>

                            <div className={`hidden min-[1450px]:flex absolute top-[384px] left-12 overflow-hidden h-[72px] w-[90px] items-start transition-all duration-500 ease-out ${activeSection >= sermon.sections.length ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                                <AnimatePresence mode="popLayout" custom={desktopDirection}>
                                    <motion.span
                                        key={activeSection}
                                        custom={desktopDirection}
                                        variants={desktopVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="text-7xl font-bold font-yisunshin text-[#2A4458] block leading-none pt-1 absolute top-0 left-0 bg-[#F4F3EF] w-full"
                                    >
                                        {String(Math.min(activeSection + 1, sermon.sections.length)).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="relative z-20 w-full pointer-events-none">
                        <div className="w-1/2 relative pointer-events-auto -mt-[calc(100vh-80px)]">
                            {sermon.sections.map((section, index) => (
                                <section
                                    key={index}
                                    ref={el => desktopSectionsRef.current[index] = el}
                                    className="min-h-[70vh] snap-start mb-24 flex flex-col items-center pt-96"
                                >
                                    <div className="w-full max-w-[60%]">
                                        {section.heading && (
                                            <h2 className="text-2xl font-bold text-[#05121C] break-keep font-pretendard leading-tight mb-8 pt-2">
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

                    {/* Messages Summary (Desktop) - Inside Long BG Wrapper to keep Title Sticky */}
                    {messagesSummary && (
                        <div
                            ref={el => desktopSectionsRef.current[sermon.sections.length] = el}
                            className="snap-start relative z-30"
                            style={{ scrollSnapStop: 'always', scrollMarginTop: '0px' }}
                        >
                            <MessagesSummarySection
                                seriesTitle={sermon.title}
                                {...messagesSummary}
                            />
                        </div>
                    )}
                </div>



                <div ref={footerRef} className="relative z-30 w-full">
                    {children}
                </div>
            </div>

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
