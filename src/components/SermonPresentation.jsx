'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Plus, X, Youtube, AudioLines, Pause } from 'lucide-react';

const FloatingMediaControls = ({ audioUrl, youtubeUrl, footerRefs }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Responsive animation
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Detect footer visibility using IntersectionObserver
    useEffect(() => {
        if (!footerRefs?.current || footerRefs.current.length === 0) {
            return;
        }

        const footer = footerRefs.current[0]; // Assuming shared footer is index 0 or simple ref
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = entry.isIntersecting;
                if (isVisible !== isFooterVisible) {
                    // console.log('Footer visibility changed:', isVisible);
                    setIsFooterVisible(isVisible);
                }
            },
            {
                root: null, // Viewport
                threshold: 0.1 // Trigger when 10% of footer is visible
            }
        );

        observer.observe(footer);

        return () => {
            if (footer) observer.unobserve(footer);
        };
    }, [footerRefs, isFooterVisible]);

    if (!audioUrl && !youtubeUrl) return null;

    // Hide controls if footer is visible, but allow a small grace period or transition if needed
    // For now, hard hide as requested: "hidden whenever the footer is visible"
    if (isFooterVisible) return null;


    return (
        <>
            {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col md:flex-row items-end md:items-center gap-2">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                                x: isMobile ? 0 : 20,
                                y: isMobile ? 20 : 0
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                x: isMobile ? 0 : 20,
                                y: isMobile ? 20 : 0
                            }}
                            className="flex flex-col md:flex-row items-center gap-2"
                        >
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

const SermonPresentation = ({ sermon, children }) => {
    // Track active section and direction together to ensure sync
    const [activeState, setActiveState] = useState({ section: 0, direction: 1 });
    const { section: activeSection, direction } = activeState;
    const sectionsRef = useRef([]);
    const footerRefs = useRef([]);

    // Handle scroll to update active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = sectionsRef.current.indexOf(entry.target);
                        if (index !== -1) {
                            setActiveState(prev => {
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
            {
                root: null,
                rootMargin: '-20% 0px -20% 0px', // Adjusted to detect center of viewport
                threshold: 0.1 // Lower threshold to detect earlier
            }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [sermon.sections.length]);

    const currentSection = sermon.sections[activeSection] || {};
    const currentVerses = currentSection.verses || []; // Get all verses for the section

    const variants = {
        enter: (direction) => ({
            y: direction > 0 ? '150%' : '-150%',
        }),
        center: {
            y: 0,
        },
        exit: (direction) => ({
            y: direction > 0 ? '-150%' : '150%',
        }),
    };

    // Dynamic Verse Alignment Logic
    const [verseAlignmentOffset, setVerseAlignmentOffset] = useState(0);

    useEffect(() => {
        const calculateOffset = () => {
            const currentSectionEl = sectionsRef.current[activeSection];
            if (!currentSectionEl) return;

            // Find the title element in the current section
            // We look for 'h2' which is the section heading
            const titleEl = currentSectionEl.querySelector('h2');

            if (titleEl) {
                // Calculate height occupied by title (offsetHeight includes padding/border)
                // Add the bottom margin (mb-8 = 32px)
                // We add a tiny buffer (e.g. 4px) for visual breathing room if needed, or strict 32.
                // Let's stick to 32px (2rem) as per Tailwind mb-8.
                setVerseAlignmentOffset(titleEl.offsetHeight + 32);
            } else {
                // If no title, body starts immediately. 
                // However, our body container has `pt-96`. 
                // If no title, the body starts AT pt-96.
                // So offset should be 0.
                setVerseAlignmentOffset(0);
            }
        };

        // Run calculation
        calculateOffset();

        // Re-calculate on resize
        window.addEventListener('resize', calculateOffset);
        return () => window.removeEventListener('resize', calculateOffset);
    }, [activeSection, sermon.sections]); // Re-run when section changes or content loads

    // Mobile Scroll Handling - Anti-Gravity System
    const mobileContainerRef = useRef(null);
    const sectionScrollPositions = useRef({}); // Store scroll position for each section
    const sectionRefs = useRef([]); // Store refs to each section's scroll container
    const [currentMobileSection, setCurrentMobileSection] = useState(0);


    // Removed unused parallax hooks

    // Anti-Gravity Scroll Functions
    const saveScrollPosition = (sectionIndex) => {
        const sectionContainer = sectionRefs.current[sectionIndex];
        if (!sectionContainer) return;

        sectionScrollPositions.current[sectionIndex] = sectionContainer.scrollTop;
    };

    const restoreScrollPosition = (sectionIndex) => {
        const sectionContainer = sectionRefs.current[sectionIndex];
        if (!sectionContainer) return;

        const savedPosition = sectionScrollPositions.current[sectionIndex] || 0;
        const maxScroll = sectionContainer.scrollHeight - sectionContainer.clientHeight;
        const clampedPosition = Math.min(savedPosition, maxScroll);

        // Smooth restoration using RAF
        requestAnimationFrame(() => {
            sectionContainer.scrollTop = clampedPosition;
        });
    };

    // Effect: Restore scroll position when section changes
    useEffect(() => {
        if (currentMobileSection >= 0 && sectionRefs.current[currentMobileSection]) {
            restoreScrollPosition(currentMobileSection);
        }
    }, [currentMobileSection]);
    // 2-Step Vertical Snapping Logic
    const mainScrollRef = useRef(null);
    const contentWrapperRef = useRef(null);
    const stickyTitleRef = useRef(null);
    const [snapState, setSnapState] = useState('FREE'); // 'FREE', 'CONTENT_SNAP', 'FOOTER_SNAP'
    const isScrollingRef = useRef(false);
    const snapTimeoutRef = useRef(null);

    const handleScroll = (e) => {
        isScrollingRef.current = true;
        if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

        // Debounce snap check on scroll end
        snapTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            handleSnapCheck();
        }, 150); // 150ms debounce for "scroll end"
    };

    const handleSnapCheck = () => {
        const container = mainScrollRef.current;
        const content = contentWrapperRef.current;
        const footer = footerRefs.current[0];

        if (!container || !content || !footer) return;

        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const contentHeight = content.offsetHeight;
        // The "Title" is sticky, so it effectively reduces the view for content, 
        // BUT for scrolling calculations, the sticky element is part of the flow.
        // We want to snap when the BOTTOM of content aligns with BOTTOM of viewport.

        // Sticky Title Height Correction:
        // If title is sticky, it's always at top. 
        // Content starts AFTER title (in DOM).
        // Total Scroll Height = Title + Content + Footer.
        // Snap Point 1 (Content End): scrollTop + viewportHeight = TitleHeight + ContentHeight

        const titleHeight = stickyTitleRef.current ? stickyTitleRef.current.offsetHeight : 0;
        const contentBottomOffset = titleHeight + contentHeight - viewportHeight;
        const footerBottomOffset = container.scrollHeight - viewportHeight;

        // Threshold for snapping (e.g., 50px)
        const threshold = 50;

        // 1. Check proximity to Content Snap
        if (Math.abs(scrollTop - contentBottomOffset) < threshold) {
            scrollToSnap(contentBottomOffset);
            setSnapState('CONTENT_SNAP');
            return;
        }

        // 2. Check proximity to Footer Snap (Bottom)
        if (Math.abs(scrollTop - footerBottomOffset) < threshold) {
            scrollToSnap(footerBottomOffset);
            setSnapState('FOOTER_SNAP');
            return;
        }

        // 3. State Transitions (if not near snap points)
        // If we are somewhat below Content Snap, assume we are moving towards Footer
        if (scrollTop > contentBottomOffset + threshold) {
            // Optional: Force snap to footer if past content? 
            // Behavior: "Only after reaching first snap... further scroll moves footer"
            // For now, let it remain FREE if between points, but maybe bias towards the nearest.
            setSnapState('FREE');
        } else {
            setSnapState('FREE');
        }
    };

    const scrollToSnap = (targetTop) => {
        if (mainScrollRef.current) {
            mainScrollRef.current.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }
    };

    // Re-measure and Reset State when Section Changes
    useEffect(() => {
        // When section changes, the content height might change (if we are resizing container).
        // Even if we don't resize, we should re-evaluate where we are.

        // Reset state to FREE initially to allow calculations to take over
        setSnapState('FREE');

        // Re-check snap context after a brief layout delay (in case height animates or reflows)
        const timer = setTimeout(() => {
            handleSnapCheck();
        }, 50);

        return () => clearTimeout(timer);
    }, [currentMobileSection]);

    // Initialize Snap State on Mount/Resize
    useEffect(() => {
        // Initial check if content is small (Tall Screen Case)
        // If content fits in viewport, start at CONTENT_SNAP or even FOOTER_SNAP logic
        const checkInitialLayout = () => {
            // Logic to handle tall screens
            // If (Title + Content) < Viewport, then ContentBottom is < 0 padding...
            // Just let the natural snap logic handle it on first interaction
        };
        // checkInitialLayout();
        window.addEventListener('resize', handleSnapCheck);
        return () => window.removeEventListener('resize', handleSnapCheck);
    }, []);

    return (
        <>
            {/* MOBILE LAYOUT (Visible < md) - Shared Vertical Scroll Refactor */}
            <div className="md:hidden flex flex-col h-[100dvh] bg-[#F4F3EF]">

                {/* 2. Main Scroll Container (Vertical Scroll) */}
                <div
                    ref={mainScrollRef}
                    className="flex-1 overflow-y-auto bg-[#F4F3EF] relative scroll-smooth"
                    onScroll={handleScroll}
                    onTouchEnd={() => setTimeout(handleSnapCheck, 50)} // Trigger check on touch release
                >
                    <div className="min-h-full flex flex-col">

                        {/* A. Sticky Sermon Title */}
                        <div
                            ref={stickyTitleRef}
                            className="sticky top-0 z-40 bg-transparent px-6"
                        >
                            {/* Background Layer with Fade - Extended solid area */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-75% to-[#F4F3EF]/0 z-0" />

                            <h1 className="text-3xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep relative z-10 pt-6 pb-10">
                                {sermon.title}
                            </h1>
                        </div>

                        {/* B. Content Wrapper (Snap Item 1) */}
                        <div ref={contentWrapperRef}>
                            {/* Horizontal Scroll Row */}
                            <div
                                ref={mobileContainerRef}
                                className="w-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
                                onScroll={(e) => {
                                    const container = e.currentTarget;
                                    const scrollLeft = container.scrollLeft;
                                    const sectionWidth = container.clientWidth;
                                    const newSection = Math.round(scrollLeft / sectionWidth);
                                    if (newSection !== currentMobileSection) {
                                        setCurrentMobileSection(newSection);
                                    }
                                }}
                            >
                                {sermon.sections.map((section, index) => (
                                    <article
                                        key={index}
                                        className="min-w-full w-full snap-center flex flex-col"
                                    >
                                        {/* Content Container */}
                                        <div className="px-6 py-12">
                                            {/* Number & Heading Row */}
                                            <div className="flex flex-row items-start pt-4 gap-4 mb-12">
                                                <span className="text-6xl font-bold font-yisunshin text-[#2A4458] leading-none">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                {section.heading && (
                                                    <h2 className="text-xl font-bold text-[#05121C] font-pretendard leading-tight break-keep flex-1 mt-1">
                                                        {section.heading}
                                                    </h2>
                                                )}
                                            </div>

                                            {/* Body Content */}
                                            <div className="text-lg leading-relaxed text-gray-600 space-y-6 break-keep font-light font-korean mb-12">
                                                {section.content.map((block) => (
                                                    <div key={block.id}>{renderSimpleBlock(block)}</div>
                                                ))}
                                            </div>

                                            {/* Divider */}
                                            <div className="flex justify-center mb-12">
                                                <div className="w-12 h-[1px] bg-[#2A4458]" />
                                            </div>

                                            {/* Verses */}
                                            <div className="space-y-8 pb-12">
                                                {section.verses && section.verses.length > 0 && section.verses.map((verse, idx) => (
                                                    <div key={idx} className="bg-transparent">
                                                        <p className="text-lg leading-relaxed text-gray-600 break-keep font-light font-korean mb-2">
                                                            {verse.text}
                                                        </p>
                                                        <p className="text-sm text-[#2A4458] font-bold text-right font-pretendard">
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
                        <footer className="shrink-0 bg-[#F4F3EF] border-t border-[#2A4458]/10 relative z-20">
                            <div ref={el => footerRefs.current[0] = el}>
                                {children}
                            </div>
                        </footer>
                    </div>
                </div>
            </div>

            {/* DESKTOP LAYOUT (Visible >= md) */}
            <div className="hidden md:block relative h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar font-pretendard">

                {/* SERMON EXPERIENCE WRAPPER - Minimum height to hold content, allows scrolling past it */}
                <div className="relative w-full bg-[#F4F3EF]">

                    {/* STICKY UI CONTAINER - Stays fixed while viewing sermon, scrolls up when footer arrives */}
                    <div className="sticky top-0 h-[calc(100vh-80px)] w-full overflow-hidden pointer-events-none z-10">

                        {/* RIGHT PANEL - Verses (Background Layer) */}
                        <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-start items-center pr-16 pt-96 overflow-hidden z-0">
                            <AnimatePresence mode="wait">
                                {currentVerses.length > 0 ? (
                                    <motion.div
                                        key={activeSection}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="w-4/5 max-w-lg space-y-8 pointer-events-auto"
                                        style={{ marginTop: verseAlignmentOffset }}
                                    >
                                        {currentVerses.map((verse, idx) => (
                                            <div key={idx} className="mb-12 last:mb-0">
                                                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 break-keep font-light font-korean" style={{ wordBreak: 'keep-all' }}>
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
                                    >
                                        {/* Empty state */}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* LEFT UI LAYERS (Title, Number) */}
                        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-gray-200">
                            {/* Fixed Title Layer */}
                            <div className="absolute top-12 left-44 w-full p-12">
                                <h1 className="text-5xl md:text-6xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep max-w-md md:max-w-lg">
                                    {sermon.title}
                                </h1>
                            </div>

                            {/* Fixed Number Layer with Slide Animation */}
                            <div className="absolute top-[384px] left-12 overflow-hidden h-32 w-40 flex items-start pl-12">
                                <AnimatePresence mode="popLayout" custom={direction}>
                                    <motion.span
                                        key={activeSection}
                                        custom={direction}
                                        variants={variants}
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

                            {/* Scroll Indicator */}
                            {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                <span className="text-2xl text-gray-400 animate-bounce">↓</span>
                            </div> */}
                        </div>
                    </div>

                    {/* SCROLLABLE CONTENT LAYER - Interactive Text */}

                    <div className="relative z-20 w-full pointer-events-none">

                        <div className="w-1/2 relative pointer-events-auto -mt-[calc(100vh-80px)]">

                            {/* Spacer for Title */}
                            <div className="h-[160px] w-full shrink-0" />

                            {sermon.sections.map((section, index) => (
                                <section
                                    key={index}
                                    ref={el => sectionsRef.current[index] = el}
                                    className="min-h-[70vh] snap-start mb-24 px-12 flex flex-row items-start justify-start pt-96"
                                >
                                    <div className="flex flex-row items-start w-full max-w-2xl">
                                        {/* Number Column (Invisible Spacer) */}
                                        <div className="w-32 shrink-0 pr-8 opacity-0">
                                            <span className="text-8xl font-bold font-yisunshin text-[#05121C] block leading-none pt-1">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>

                                        {/* Content Column (Heading + Body) */}
                                        <div className="flex-1 pl-12">
                                            {section.heading && (
                                                <h2 className="text-2xl font-bold text-[#05121C] break-keep font-pretendard leading-tight mb-8 pt-2">
                                                    {section.heading}
                                                </h2>
                                            )}

                                            <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 space-y-4 sm:space-y-6 md:space-y-8 break-keep font-light font-korean">
                                                {section.content.map((block, i) => (
                                                    <div key={block.id}>{renderSimpleBlock(block)}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                            {/* Spacer at bottom of sermon content to separate from footer */}
                            <div className="h-[20vh] w-full shrink-0" />
                        </div>
                    </div>
                </div>

                {/* FOOTER - Flows naturally after the sermon wrapper */}
                <div ref={el => footerRefs.current[0] = el} className="relative z-30 w-full snap-start">
                    {children}
                </div>

            </div>

            {/* Floating Media Controls - Visible on all screen sizes */}
            <FloatingMediaControls audioUrl={sermon.audio} youtubeUrl={sermon.youtube} footerRefs={footerRefs} />
        </>
    );
};

const Text = ({ text }) => {
    if (!text) {
        return null;
    }
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

    if (type === 'paragraph') {
        return <p><Text text={value.rich_text} /></p>;
    } else if (type === 'heading_1') {
        return <h1 className="text-2xl font-bold mt-4 mb-2"><Text text={value.rich_text} /></h1>;
    } else if (type === 'heading_2') {
        return <h2 className="text-xl font-bold mt-3 mb-2"><Text text={value.rich_text} /></h2>;
    } else if (type === 'heading_3') {
        return <h3 className="text-lg font-bold mt-2 mb-1"><Text text={value.rich_text} /></h3>;
    } else if (type === 'bulleted_list_item') {
        return <li className="list-disc ml-4"><Text text={value.rich_text} /></li>;
    } else if (type === 'numbered_list_item') {
        return <li className="list-decimal ml-4"><Text text={value.rich_text} /></li>;
    } else if (type === 'quote') {
        return <blockquote className="border-l-4 border-gray-300 pl-4 italic"><Text text={value.rich_text} /></blockquote>;
    } else if (type === 'callout') {
        return (
            <div className="p-4 bg-gray-100 rounded flex gap-4">
                {value.icon?.emoji && <span>{value.icon.emoji}</span>}
                <div><Text text={value.rich_text} /></div>
            </div>
        );
    }

    return null;
};

export default SermonPresentation;
