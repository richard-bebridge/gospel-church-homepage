'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotionRenderer, { TableAlignmentProvider } from '../sermon/NotionRenderer';
import AboutSideNav from '../about/AboutSideNav';
import Header from '../Header';
import Footer from '../Footer';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';
import { RightPanelController } from '../presentation/RightPanelController';

import {
    SCROLL_COOLDOWN_MS,
    SCROLL_THRESHOLD_DELTA
} from '../sermon/constants';
import { groupGalleryBlocks } from '../../lib/utils/notionBlockMerger';
import { extractMapToken } from '../../lib/utils/visitMapHelpers';
import LoadingSequence from '../ui/LoadingSequence';
import FloatingVisitButton from './FloatingVisitButton';
import { waitForFonts } from '../../lib/utils/fontLoader';

const LOCATION = {
    lat: 37.49168,
    lng: 127.01340,
    label: 'Gospel Church'
};

const VisitPresentation = ({ sections: rawSections, siteSettings }) => {
    // ----------------------------------------------------------------
    // Intro & Loading State
    // ----------------------------------------------------------------
    const instanceId = useRef(Math.random().toString(36).substr(2, 5));
    console.log(`[VisitPresentation:${instanceId.current}] RENDER`, performance.now());

    const settings = siteSettings || {};
    // Intro & Loading State
    // ----------------------------------------------------------------
    const [fontsReady, setFontsReady] = useState(false);
    const { desktopBodyClass, isSettled: fontScaleSettled } = useFontScale();

    useEffect(() => {
        const checkReady = async () => {
            await waitForFonts([
                '400 18px Pretendard',
                '700 48px YiSunShin',
                '700 30px Montserrat',
            ]);
            setFontsReady(true);
        };
        checkReady();
    }, []);

    // 1. Initial Readiness Check State

    // ----------------------------------------------------------------      
    // 0. Pre-process Sections
    // ---------------------------------------------------------------- 
    const sections = React.useMemo(() => {
        if (!rawSections) return [];
        return rawSections.map(section => {
            let mapCoords = null;
            if (section.rightPanelType === 'map') {
                for (const block of section.content) {
                    if (block.type === 'paragraph' && block.paragraph?.rich_text) {
                        const plainText = block.paragraph.rich_text.map(t => t.plain_text).join('');
                        const token = extractMapToken(plainText);
                        if (token) {
                            mapCoords = { x: token.x, y: token.y };
                            break;
                        }
                    }
                }
            }
            return { ...section, mapCoords };
        });
    }, [rawSections]);

    const isReady = sections && sections.length > 0 && fontsReady && fontScaleSettled;

    // ----------------------------------------------------------------      
    // 1. State & Refs
    // ----------------------------------------------------------------      
    const [activeIndex, setActiveIndex] = useState(0);

    // ----------------------------------------------------------------      
    // 5. Data Fetching for 'page' type (Moved up for initialization)
    // ----------------------------------------------------------------
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const footerRef = useRef(null);

    // Sentinels for End detection
    const sectionEndSentinels = useRef([]);
    const isSectionEndVisible = useRef(false);

    // Gating
    const isAutoScrollingRef = useRef(false);
    const wheelAccumRef = useRef(0);

    // Derived
    const isFooter = activeIndex === sections.length;

    // Guard (handled by isReady gating below, but keeping for data safety)
    if (!sections || sections.length === 0) {
        return <LoadingSequence />;
    }

    // ----------------------------------------------------------------      
    // 2. Snap Logic
    // ----------------------------------------------------------------      
    const performSnap = (targetIndex) => {
        if (!containerRef.current) return;

        // Lock
        isAutoScrollingRef.current = true;
        wheelAccumRef.current = 0;

        // State Update
        setActiveIndex(targetIndex);

        // Calculate Target Position
        let top = 0;
        if (targetIndex < sections.length) {
            // Section Snap -> Top of Section
            const el = sectionRefs.current[targetIndex];
            if (el) top = el.offsetTop;
        } else {
            // Footer Snap -> Top of Footer
            if (footerRef.current) top = footerRef.current.offsetTop;
        }

        // Scroll
        containerRef.current.scrollTo({
            top,
            behavior: 'smooth'
        });

        // Unlock
        setTimeout(() => {
            isAutoScrollingRef.current = false;
            wheelAccumRef.current = 0;
        }, SCROLL_COOLDOWN_MS);
    };

    // ----------------------------------------------------------------      
    // 3. Sentinel Observer (End Detection)
    // ----------------------------------------------------------------      
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isSectionEndVisible.current = entry.isIntersecting;
            },
            { root: containerRef.current, threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
        );

        if (activeIndex < sections.length) {
            const sentinel = sectionEndSentinels.current[activeIndex];
            if (sentinel) observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [activeIndex, sections.length]);

    // ----------------------------------------------------------------      
    // 4. Wheel Handler (Free Scroll + Snap)
    // ----------------------------------------------------------------      
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (isAutoScrollingRef.current) {
                e.preventDefault();
                return;
            }

            wheelAccumRef.current += e.deltaY;

            if (Math.abs(wheelAccumRef.current) < SCROLL_THRESHOLD_DELTA) {
                const isDown = e.deltaY > 0;
                const isUp = e.deltaY < 0;

                if (isDown && !isSectionEndVisible.current) return;

                if (activeIndex < sections.length) {
                    const el = sectionRefs.current[activeIndex];
                    if (el && isUp) {
                        const distFromTop = Math.abs(container.scrollTop - el.offsetTop);
                        if (distFromTop > 10) return;
                    }
                } else {
                    if (isUp) return;
                }

                e.preventDefault();
                return;
            }

            const isDown = wheelAccumRef.current > 0;
            const isUp = wheelAccumRef.current < 0;

            if (isDown) {
                if (activeIndex < sections.length) {
                    if (isSectionEndVisible.current) {
                        e.preventDefault();
                        performSnap(activeIndex + 1);
                    } else {
                        wheelAccumRef.current = 0;
                    }
                } else {
                    e.preventDefault();
                }
            } else if (isUp) {
                if (activeIndex > 0) {
                    if (activeIndex === sections.length) {
                        e.preventDefault();
                        performSnap(activeIndex - 1);
                    } else {
                        const el = sectionRefs.current[activeIndex];
                        if (el) {
                            const distFromTop = Math.abs(container.scrollTop - el.offsetTop);
                            if (distFromTop < 50) {
                                e.preventDefault();
                                performSnap(activeIndex - 1);
                            } else {
                                wheelAccumRef.current = 0;
                            }
                        }
                    }
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        const resetAccum = () => { wheelAccumRef.current = 0; };
        container.addEventListener('pointerup', resetAccum);
        container.addEventListener('mouseleave', resetAccum);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('pointerup', resetAccum);
            container.removeEventListener('mouseleave', resetAccum);
        };
    }, [activeIndex, sections.length]);

    // ----------------------------------------------------------------      
    // Data Render
    // ---------------------------------------------------------------- 

    // ----------------------------------------------------------------
    // Render Right Panel
    // ----------------------------------------------------------------
    const renderRightPanel = () => {
        if (!sections[activeIndex] || isFooter) return null;

        const safeIndex = Math.min(activeIndex, sections.length - 1);
        const section = sections[safeIndex];
        const { rightPanelType, imgSrc, mapCoords, pageContent } = section;

        let data = imgSrc;
        if (rightPanelType === 'page') data = pageContent;
        if (rightPanelType === 'map') data = mapCoords;
        if (rightPanelType === 'verse') data = section.scriptureTags;

        return (
            <RightPanelController
                isVisible={!isFooter}
                mode={rightPanelType}
                data={data}
                title={section.title}
                uniqueKey={section.id}
            />
        );
    };

    return (
        <div className="relative min-h-screen bg-[#F4F3EF] text-[#1A1A1A]">
            <AnimatePresence mode="wait">
                {!isReady && <LoadingSequence />}
            </AnimatePresence>

            <div className="fixed top-0 left-0 w-full z-[120]">
                <Header siteSettings={siteSettings} />
            </div>

            <div
                ref={containerRef}
                style={{
                    paddingTop: `${HEADER_HEIGHT_PX}px`,
                    visibility: isReady ? 'visible' : 'hidden'
                }}
                className="hidden md:block relative h-screen overflow-y-auto no-scrollbar font-pretendard"
            >
                <div className="relative w-full bg-[#F4F3EF]">

                    {/* Sticky Container */}
                    <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-30">
                        {/* Right Panel */}
                        {renderRightPanel()}

                        {/* Left Panel */}
                        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-[#2A4458]/10 flex flex-col items-center pt-0 pointer-events-none">
                            {/* Sticky Number */}
                            <div className={`hidden min-[1450px]:flex absolute left-12 overflow-hidden h-[72px] w-[90px] items-start transition-opacity duration-300 ${isFooter ? 'opacity-0' : 'opacity-100'}`}
                                style={{ top: '384px' }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={activeIndex}
                                        initial={{ y: 100 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: -100 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-7xl font-bold font-yisunshin text-[#2A4458] block leading-none pt-1"
                                    >
                                        {String(Math.min(activeIndex + 1, sections.length)).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Side Nav */}
                        <div className="absolute right-0 z-50 pointer-events-auto"
                            style={{ top: '384px', transform: 'translateY(-50%)' }}
                        >
                            <AboutSideNav
                                sections={sections}
                                activeIndex={isFooter ? sections.length : activeIndex}
                                onSectionClick={performSnap}
                            />
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="relative z-20 w-full pointer-events-none">
                        <div className="w-1/2 relative pointer-events-auto -mt-[100vh]">
                            {sections.map((section, index) => (
                                <section
                                    key={section.id}
                                    ref={el => sectionRefs.current[index] = el}
                                    className="min-h-[120vh] mb-0 flex flex-col items-center pt-0 pb-[40vh]"
                                >
                                    <div className="w-full max-w-[60%] relative">
                                        {/* Title */}
                                        <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ paddingTop: '96px' }}>
                                            <span className="text-[#2A4458] font-sans font-bold text-sm tracking-widest uppercase mb-4 block">
                                                {section.title}
                                            </span>
                                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold font-yisunshin text-[#05121C] leading-tight break-keep mb-12">
                                                {section.heading || section.title}
                                            </h1>
                                        </div>

                                        {/* Body */}
                                        <div className="w-full pointer-events-auto" style={{ paddingTop: '384px' }}>
                                            <TableAlignmentProvider blocks={section.content}>
                                                {groupGalleryBlocks(section.content).map((block) => {
                                                    // Inline Map Handling
                                                    if (block.type === 'paragraph' && block.paragraph?.rich_text) {
                                                        const plainText = block.paragraph.rich_text.map(t => t.plain_text).join('');
                                                        const token = extractMapToken(plainText);
                                                        if (token) {
                                                            return (
                                                                <div key={block.id} className="col-span-full w-full my-12">
                                                                    <RightPanelMap
                                                                        x={token.x}
                                                                        y={token.y}
                                                                        title={section.title}
                                                                        isInline={true}
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    }

                                                    return (
                                                        <NotionRenderer
                                                            key={block.id}
                                                            block={block}
                                                            bodyClass={desktopBodyClass}
                                                        />
                                                    );
                                                })}
                                            </TableAlignmentProvider>
                                            {/* Sentinel for End Detection */}
                                            <div ref={el => sectionEndSentinels.current[index] = el} className="h-px w-full bg-transparent" />
                                        </div>
                                    </div>
                                </section>
                            ))}

                            {/* Footer Section */}
                            <div ref={footerRef} className="w-[200%] -ml-0 pointer-events-auto min-h-[50vh] flex items-end">
                                <Footer siteSettings={siteSettings} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden w-full bg-[#F4F3EF] pt-20">
                {sections.map((section, idx) => (
                    <div key={section.id} className="px-6 py-12 border-b border-gray-200 last:border-0">
                        <div className="text-6xl font-yisunshin font-bold text-[#2A4458]/20 mb-4">{String(idx + 1).padStart(2, '0')}</div>
                        <span className="text-sm font-bold text-[#2A4458] tracking-widest uppercase mb-2 block">{section.title}</span>
                        <h2 className="text-3xl font-yisunshin font-bold text-[#05121C] mb-8 leading-tight">
                            {section.heading || section.title}
                        </h2>
                        <div className="prose font-korean text-gray-600">
                            {section.content.map(block => <NotionRenderer key={block.id} block={block} />)}
                        </div>
                    </div>
                ))}
                <Footer siteSettings={siteSettings} />
            </div>

            {/* Floating Button */}
            <FloatingVisitButton footerRef={footerRef} />
        </div>
    );
};

export default VisitPresentation;
