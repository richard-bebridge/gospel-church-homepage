'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Plus, X, Youtube, AudioLines, Pause } from 'lucide-react';

// =========================================
// 0. Swipe Indicator Component (New)
//    - Visualizes current section index
//    - Sliding Dot Animation (2px x 2px)
// =========================================
const SwipeIndicator = ({ total, current, className }) => {
    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="relative">
                    {/* Background Dot (Always visible) */}
                    <div className="w-[2px] h-[2px] rounded-full bg-[#05121C]/20" />

                    {/* Active Sliding Dot */}
                    {i === current && (
                        <motion.div
                            layoutId="active-indicator"
                            className="absolute inset-0 w-[2px] h-[2px] rounded-full bg-[#05121C]"
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 40 // Minimal bounce, mostly smooth slide
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// =========================================
// 1. FloatingMediaControls Component
//    - Handles Play/Pause of Audio
//    - Handles YouTube Link
//    - Handles Font Size Toggle (A+/A-)
//    - Auto-hides when Footer is visible
// =========================================
const FloatingMediaControls = ({ audioUrl, youtubeUrl, footerRef, fontScale, onToggleFontScale }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const audioRef = useRef(null);

    // Toggle Audio Playback
    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Responsive Check (for animation variants)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Footer Visibility Detection (Hide controls when footer appears)
    useEffect(() => {
        const footer = footerRef?.current;
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0.1 // 10% visibility triggers hide
            }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, [footerRef]);

    // Render Guard
    if ((!audioUrl && !youtubeUrl) || isFooterVisible) return null;

    // Animation Variants
    const controlsVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            x: isMobile ? 0 : 20,
            y: isMobile ? 20 : 0
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            x: isMobile ? 0 : 20,
            y: isMobile ? 20 : 0
        }
    };

    return (
        <>
            {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col md:flex-row items-end md:items-center gap-2">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={controlsVariants}
                            className="flex flex-col md:flex-row items-center gap-2"
                        >
                            {/* Font Size Toggle Button */}
                            <button
                                onClick={onToggleFontScale}
                                className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF] font-bold font-serif"
                            >
                                {fontScale === 'normal' ? 'A+' : 'A-'}
                            </button>

                            {/* Audio Button */}
                            {audioUrl && (
                                <button
                                    onClick={toggleAudio}
                                    className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                                >
                                    {isPlaying ? <Pause size={18} /> : <AudioLines size={18} />}
                                </button>
                            )}

                            {/* YouTube Button */}
                            {youtubeUrl && (
                                <button
                                    onClick={() => window.open(youtubeUrl, '_blank')}
                                    className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                                >
                                    <Youtube size={18} />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                >
                    <AnimatePresence mode="wait">
                        {isExpanded ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <X size={20} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                            >
                                <Plus size={20} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </>
    );
};


// =========================================
// 2. Helper Components (Text Rendering)
// =========================================

const Text = ({ text }) => {
    if (!text) return null;
    return text.map((value, i) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;
        return (
            <span
                key={i}
                className={[
                    bold ? "font-bold" : "",
                    code ? "bg-gray-100 p-1 rounded font-mono text-sm" : "",
                    italic ? "italic" : "",
                    strikethrough ? "line-through" : "",
                    underline ? "underline" : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.link ? <a href={text.link.url} className="underline text-blue-600">{text.content}</a> : text.content}
            </span>
        );
    });
};

const renderSimpleBlock = (block) => {
    const { type } = block;
    const value = block[type];
    if (!value?.rich_text) return null;

    switch (type) {
        case 'paragraph':
            return <p><Text text={value.rich_text} /></p>;
        case 'heading_1':
            return <h1 className="text-3xl font-bold mt-4 mb-2"><Text text={value.rich_text} /></h1>;
        case 'heading_2':
            return <h2 className="text-2xl font-bold mt-3 mb-2"><Text text={value.rich_text} /></h2>;
        case 'heading_3':
            return <h3 className="text-xl font-bold mt-2 mb-1"><Text text={value.rich_text} /></h3>;
        case 'bulleted_list_item':
            return <li className="list-disc ml-4"><Text text={value.rich_text} /></li>;
        case 'numbered_list_item':
            return <li className="list-decimal ml-4"><Text text={value.rich_text} /></li>;
        case 'quote':
            return <blockquote className="border-l-4 border-gray-300 pl-4 italic"><Text text={value.rich_text} /></blockquote>;
        case 'callout':
            return (
                <div className="p-4 bg-gray-100 rounded flex gap-4">
                    {value.icon?.emoji && <span>{value.icon.emoji}</span>}
                    <div><Text text={value.rich_text} /></div>
                </div>
            );
        default:
            return null;
    }
};


// =========================================
// 3. Main SermonPresentation Component
// =========================================
const SermonPresentation = ({ sermon, children }) => {
    // ------------------------------------------------------------------
    // Shared Resources
    // ------------------------------------------------------------------
    const footerRef = useRef(null); // Reference to the shared footer

    // Font Scale State
    const [fontScale, setFontScale] = useState('normal');

    // Load Font Scale from Local Storage
    useEffect(() => {
        const savedScale = localStorage.getItem('fontScale');
        if (savedScale === 'large' || savedScale === 'normal') {
            setFontScale(savedScale);
        }
    }, []);

    // Toggle Font Scale Handler
    const handleToggleFontScale = () => {
        const newScale = fontScale === 'normal' ? 'large' : 'normal';
        setFontScale(newScale);
        localStorage.setItem('fontScale', newScale);
    };

    // Derived Classes based on Font Scale
    const bodyTextClass = fontScale === 'normal'
        ? "text-xl leading-relaxed text-gray-600 space-y-6 break-keep font-light font-korean mb-12"
        : "text-2xl leading-loose text-gray-700 space-y-8 break-keep font-light font-korean mb-12"; // Larger text & looser leading

    const verseTextClass = fontScale === 'normal'
        ? "text-xl leading-relaxed text-gray-600 break-keep font-light font-korean mb-2"
        : "text-2xl leading-loose text-gray-700 break-keep font-light font-korean mb-3";

    // Desktop classes (if we want to apply sharing)
    const desktopBodyClass = fontScale === 'normal'
        ? "text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 space-y-4 sm:space-y-6 md:space-y-8 break-keep font-light font-korean"
        : "text-lg sm:text-xl md:text-2xl leading-loose text-gray-700 space-y-6 sm:space-y-8 md:space-y-10 break-keep font-light font-korean";

    const desktopVerseClass = fontScale === 'normal'
        ? "text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 break-keep font-light font-korean"
        : "text-lg sm:text-xl md:text-2xl leading-loose text-gray-700 break-keep font-light font-korean";


    // ------------------------------------------------------------------
    // A. Desktop Logic (Horizontal Slide + Vertical Scroll)
    // ------------------------------------------------------------------
    const [desktopState, setDesktopState] = useState({ section: 0, direction: 1 });
    const { section: activeSection, direction: desktopDirection } = desktopState;
    const desktopSectionsRef = useRef([]); // To track section elements for IntersectionObserver
    const [verseAlignmentOffset, setVerseAlignmentOffset] = useState(0); // For matching Right Panel Verse to Left Panel Body

    // [Desktop] Active Section Detection
    useEffect(() => {
        // ... (existing observer logic)
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = desktopSectionsRef.current.indexOf(entry.target);
                        if (index !== -1) {
                            setDesktopState(prev => {
                                if (prev.section === index) return prev;
                                return {
                                    section: index,
                                    direction: index > prev.section ? 1 : -1
                                };
                            });
                        }
                    }
                });
            },
            { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 }
        );

        desktopSectionsRef.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [sermon.sections.length]);

    // [Desktop] Dynamic Verse Alignment (JS Calc)
    // Measures the height of the currently active Section Title to align verses correctly
    useEffect(() => {
        const calculateOffset = () => {
            // ... (existing offset logic)
            const currentSectionEl = desktopSectionsRef.current[activeSection];
            if (!currentSectionEl) return;

            const titleEl = currentSectionEl.querySelector('h2');
            if (titleEl) {
                // Title Height + Tailwind 'mb-8' (32px)
                setVerseAlignmentOffset(titleEl.offsetHeight + 32);
            } else {
                setVerseAlignmentOffset(0);
            }
        };

        calculateOffset();
        window.addEventListener('resize', calculateOffset);
        return () => window.removeEventListener('resize', calculateOffset);
    }, [activeSection, sermon.sections, fontScale]); // Add fontScale dependency as it affects height!


    // ------------------------------------------------------------------
    // B. Mobile Logic (Shared Vertical Scroll + Horizontal Swipe)
    // ------------------------------------------------------------------
    const [currentMobileSection, setCurrentMobileSection] = useState(0);
    const [contentHeight, setContentHeight] = useState('auto');

    // Refs
    // const mainScrollRef = useRef(null); // Removed: Window scroll is used now
    const contentWrapperRef = useRef(null);
    const stickyTitleRef = useRef(null);
    const mobileSectionRefs = useRef([]);

    // [Mobile] Handle Horizontal Swipe Section Change
    const handleHorizontalScroll = (e) => {
        const container = e.currentTarget;
        const newSection = Math.round(container.scrollLeft / container.clientWidth);

        if (newSection !== currentMobileSection) {
            setCurrentMobileSection(newSection);
            // 1. Reset Vertical Scroll to Top
            window.scrollTo({ top: 0, behavior: 'instant' }); // Use instant to avoid fighting with scroll snap momentum
        }
    };

    // [Mobile] Dynamic Height Adjustment using ResizeObserver
    // This ensures that even if images load or content expands, the wrapper height updates.
    useEffect(() => {
        const currentElement = mobileSectionRefs.current[currentMobileSection];
        if (!currentElement) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Use borderBoxSize if available, fallback to clientHeight
                const height = entry.borderBoxSize?.[0]?.blockSize || entry.target.getBoundingClientRect().height;
                setContentHeight(height);
            }
        });

        observer.observe(currentElement);

        return () => {
            observer.disconnect();
        };
    }, [currentMobileSection, sermon.sections, fontScale]); // Add fontScale dependency
    // Note: No window.resize listener needed because ResizeObserver handles it.


    // ------------------------------------------------------------------
    // Render Variables
    // ------------------------------------------------------------------
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

                {/* Vertical Scroll is now handled by the Window/Body */}
                <div className="relative w-full">
                    <div className="flex flex-col w-full">

                        {/* A. Sticky Sermon Title */}
                        {/* Header is fixed h-16 (4rem). Page has pt-20 (5rem). Gap is 1rem. */}
                        {/* We use -mt-4 to pull it up 1rem so it sticks immediately at top-16 (4rem) */}
                        <div ref={stickyTitleRef} className="sticky top-16 z-40 bg-transparent px-6 -mt-4">
                            {/* Background: Opaque at Top -> Transparent at Bottom */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-75% to-[#F4F3EF]/0 z-0" />

                            <h1 className="text-4xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep relative z-10 pt-6 pb-6">
                                {sermon.title}
                            </h1>

                            {/* Swipe Indicator (Visible below Title) */}
                            <div className="relative z-10 pb-6">
                                <SwipeIndicator
                                    total={sermon.sections.length}
                                    current={currentMobileSection}
                                />
                            </div>
                        </div>

                        {/* B. Content Wrapper */}
                        {/* Dynamic Height applied here to match active section perfectly */}
                        <div ref={contentWrapperRef} style={{ height: contentHeight }} className="overflow-hidden relative w-full">
                            {/* Horizontal Slider for Sections */}
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
                                        <div className="px-6 py-12">
                                            {/* Section Header: Number + Heading */}
                                            <div className="flex flex-row items-start pt-4 gap-4 mb-12">
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
                                                    <div key={block.id}>{renderSimpleBlock(block)}</div>
                                                ))}
                                            </div>

                                            {/* Divider */}
                                            <div className="flex justify-center mb-12">
                                                <div className="w-12 h-[1px] bg-[#2A4458]" />
                                            </div>

                                            {/* Bible Verses */}
                                            <div className="space-y-8 pb-12">
                                                {section.verses?.map((verse, idx) => (
                                                    <div key={idx} className="bg-transparent">
                                                        <p className={verseTextClass}>
                                                            {verse.text}
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

                        {/* C. Footer (Snap Item 2) */}
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

                {/* Content Wrapper */}
                <div className="relative w-full bg-[#F4F3EF]">

                    {/* Sticky Left/Right Panel Container */}
                    <div className="sticky top-0 h-[calc(100vh-80px)] w-full overflow-hidden pointer-events-none z-10">

                        {/* Right Panel: Bible Verses */}
                        <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-start items-center pr-16 pt-96 overflow-hidden z-0">
                            <AnimatePresence mode="wait">
                                {desktopVerses.length > 0 ? (
                                    <motion.div
                                        key={activeSection}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="w-4/5 max-w-lg space-y-8 pointer-events-auto"
                                        style={{ marginTop: verseAlignmentOffset }} // Matches Left Panel Body Start
                                    >
                                        {desktopVerses.map((verse, idx) => (
                                            <div key={idx} className="mb-12 last:mb-0">
                                                <p className={desktopVerseClass} style={{ wordBreak: 'keep-all' }}>
                                                    {verse.text}
                                                </p>
                                                <div className="h-4" />
                                                <p className="text-sm text-[#2A4458] font-bold text-right font-pretendard">
                                                    {verse.reference}
                                                </p>
                                            </div>
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
                        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-gray-200">
                            {/* Fixed Title */}
                            <div className="absolute top-12 left-44 w-full p-12">
                                <h1 className="text-5xl md:text-6xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep max-w-md md:max-w-lg">
                                    {sermon.title}
                                </h1>
                                {/* Swipe Indicator (Desktop) */}
                                <div className="mt-8">
                                    <SwipeIndicator
                                        total={sermon.sections.length}
                                        current={activeSection}
                                    />
                                </div>
                            </div>

                            {/* Animated Number */}
                            <div className="absolute top-[384px] left-12 overflow-hidden h-32 w-40 flex items-start pl-12">
                                <AnimatePresence mode="popLayout" custom={desktopDirection}>
                                    <motion.span
                                        key={activeSection}
                                        custom={desktopDirection}
                                        variants={desktopVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="text-8xl font-bold font-yisunshin text-[#2A4458] block leading-none pt-1 absolute top-0 left-0 bg-[#F4F3EF] w-full"
                                    >
                                        {String(activeSection + 1).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Layer */}
                    <div className="relative z-20 w-full pointer-events-none">
                        <div className="w-1/2 relative pointer-events-auto -mt-[calc(100vh-80px)]">
                            {/* Top Spacer */}
                            <div className="h-[160px] w-full shrink-0" />

                            {sermon.sections.map((section, index) => (
                                <section
                                    key={index}
                                    ref={el => desktopSectionsRef.current[index] = el}
                                    className="min-h-[70vh] snap-start mb-24 px-12 flex flex-row items-start justify-start pt-96"
                                >
                                    <div className="flex flex-row items-start w-full max-w-2xl">
                                        {/* Spacer for Number Column */}
                                        <div className="w-32 shrink-0 pr-8 opacity-0">...</div>

                                        {/* Main Content */}
                                        <div className="flex-1 pl-12">
                                            {section.heading && (
                                                <h2 className="text-2xl font-bold text-[#05121C] break-keep font-pretendard leading-tight mb-8 pt-2">
                                                    {section.heading}
                                                </h2>
                                            )}
                                            <div className={desktopBodyClass}>
                                                {section.content.map(block => (
                                                    <div key={block.id}>{renderSimpleBlock(block)}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                            {/* Bottom Spacer */}
                            <div className="h-[20vh] w-full shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Shared Footer (Desktop) */}
                <div ref={footerRef} className="relative z-30 w-full snap-start">
                    {children}
                </div>
            </div>

            {/* Floating Controls */}
            <FloatingMediaControls
                audioUrl={sermon.audio}
                youtubeUrl={sermon.youtube}
                footerRef={footerRef}
                fontScale={fontScale}
                onToggleFontScale={handleToggleFontScale}
            />
        </>
    );
};

export default SermonPresentation;
