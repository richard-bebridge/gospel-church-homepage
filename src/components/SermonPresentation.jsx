'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SermonPresentation = ({ sermon, children }) => {
    // Track active section and direction together to ensure sync
    const [activeState, setActiveState] = useState({ section: 0, direction: 1 });
    const { section: activeSection, direction } = activeState;
    const sectionsRef = useRef([]);

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

    return (
        <div className="relative h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar font-pretendard">

            {/* SERMON EXPERIENCE WRAPPER - Minimum height to hold content, allows scrolling past it */}
            <div className="relative w-full bg-[#F4F3EF]">

                {/* STICKY UI CONTAINER - Stays fixed while viewing sermon, scrolls up when footer arrives */}
                <div className="sticky top-0 h-[calc(100vh-80px)] w-full overflow-hidden pointer-events-none z-10">

                    {/* RIGHT PANEL - Verses (Background Layer) */}
                    <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center pr-16 pt-32 overflow-hidden z-0">
                        <AnimatePresence mode="wait">
                            {currentVerses.length > 0 ? (
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="max-w-lg space-y-8 pointer-events-auto"
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
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                            <span className="text-2xl text-gray-400 animate-bounce">↓</span>
                        </div>
                    </div>
                </div>

                {/* SCROLLABLE CONTENT LAYER - Interactive Text */}
                {/* Positioned absolutely on top of the sticky container within the wrapper, BUT relies on the wrapper's height */}
                {/* Actually, for typical sticky behavior, the content needs to be in the normal flow so it pushes the height. */}
                {/* To achieve the "overlay" effect while keeping content strictly on the left, we use a relative container with negative margin or absolute positioning that respects the flow. */}
                {/* Let's try: The content is the "height provider". It behaves normally. The sticky container is just a background. */}

                <div className="relative z-20 w-full pointer-events-none">
                    {/* We need the content to actually scroll. The content div must be inside the main scrollable parent (the top-level div). */}
                    {/* The structure implies: Top Level (Scroll) -> Wrapper -> Sticky UI (Top 0) + Content (Normal Flow). */}

                    <div className="w-1/2 relative pointer-events-auto -mt-[calc(100vh-80px)]">
                        {/* Negative margin pulls content up to overlap the sticky container, effectively starting at top */}
                        {/* Wait, sticky needs space to stick. If content overlaps it entirely, it's fine. */}

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
            <div className="relative z-30 w-full snap-start">
                {children}
            </div>

        </div>
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
