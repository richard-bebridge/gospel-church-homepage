'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotionRenderer, { TableAlignmentProvider } from '../sermon/NotionRenderer';
import AboutSideNav from './AboutSideNav';
import Header from '../Header';
import Footer from '../Footer';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';
import { RightPanelController } from '../presentation/RightPanelController';
import { groupGalleryBlocks } from '../../lib/utils/notionBlockMerger';
import LoadingSequence from '../ui/LoadingSequence';
import { waitForFonts } from '../../lib/utils/fontLoader';
import { fastNormalize } from '../../lib/utils/textPipeline';
import { useSnapScrollState } from '../../hooks/useSnapScroll';

const AboutPresentation = ({ sections, siteSettings }) => {
    // ----------------------------------------------------------------
    // Intro & Loading State
    // ----------------------------------------------------------------
    useEffect(() => {
        const instanceId = Math.random().toString(36).substr(2, 5);
        console.log(`[AboutPresentation:${instanceId}] MOUNTED`, performance.now());
    }, []);

    const [fontsReady, setFontsReady] = useState(false);
    const { desktopBodyClass, isSettled: fontScaleSettled } = useFontScale();

    useEffect(() => {
        const checkReady = async () => {
            console.log("[AboutPresentation] Waiting for fonts...");
            await waitForFonts([
                '400 18px Pretendard',
                '700 48px YiSunShin',
                '700 30px Montserrat',
            ]);
            console.log("[AboutPresentation] Fonts ready!");
            setFontsReady(true);
        };
        checkReady();
    }, []);

    const isReady = sections && sections.length > 0 && fontsReady && fontScaleSettled;

    // DEBUG OVERLAY
    if (typeof window !== 'undefined' && !isReady) {
        // console.log("Waiting...", { sections: sections?.length, fontsReady, fontScaleSettled });
    }

    useEffect(() => {
        console.log("[AboutPresentation] Readiness Audit:", {
            hasSections: !!sections,
            sectionsLength: sections?.length,
            fontsReady,
            fontScaleSettled,
            isReady
        });
    }, [sections, fontsReady, fontScaleSettled, isReady]);

    // ----------------------------------------------------------------      
    // 1. State & Refs
    // ---------------------------------------------------------------- 
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const footerRef = useRef(null);

    const {
        activeIndex,
        isFooter,
        sectionEndSentinels,
        performSnap
    } = useSnapScrollState(sections, {
        containerRef,
        sectionRefs,
        footerRef
    });

    // ----------------------------------------------------------------      
    // Data Render
    // ---------------------------------------------------------------- 

    // Right Panel Render
    const renderRightPanel = () => {
        if (!sections[activeIndex] || isFooter) return null;

        const safeIndex = Math.min(activeIndex, sections.length - 1);
        const section = sections[safeIndex];
        const { rightPanelType, imgSrc, pageContent } = section;

        return (
            <RightPanelController
                isVisible={!isFooter}
                mode={rightPanelType}
                data={
                    rightPanelType === 'page' ? pageContent :
                        rightPanelType === 'verse' ? section.scriptureTags :
                            imgSrc
                }
                title={section.title}
                uniqueKey={section.id}
            />
        );
    };

    return (
        <div className="relative min-h-screen bg-[#F4F3EF] text-[#1A1A1A]">
            <LoadingSequence isReady={isReady} />

            {/* Structural stability: keep DOM identical during hydration */}
            <div
                className="transition-all duration-1000"
                style={{
                    opacity: isReady ? 1 : 0.5,
                    filter: isReady ? 'none' : 'blur(5px)',
                    pointerEvents: isReady ? 'auto' : 'none'
                }}
            >
                <div className="fixed top-0 left-0 w-full z-[120]">
                    <Header siteSettings={siteSettings} />
                </div>

                <div
                    ref={containerRef}
                    style={{
                        paddingTop: `${HEADER_HEIGHT_PX}px`
                    }}
                    className="hidden md:block relative h-screen overflow-y-auto no-scrollbar font-mono"
                >
                    <div className="relative w-full bg-[#F4F3EF]">

                        {/* Sticky Container */}
                        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-30">
                            {/* Right Panel */}
                            {renderRightPanel()}

                            {/* Left Panel */}
                            <div className="absolute left-0 top-0 w-1/2 h-full border-r border-[#2A4458]/10 flex flex-col items-center pt-0 pointer-events-none">
                                {/* Sticky Number (Aligned with Body Start Baseline: 384px) */}
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
                                            className="text-7xl font-bold font-korean text-[#2A4458] block leading-none pt-1"
                                        >
                                            {fastNormalize(String(Math.min(activeIndex + 1, sections.length)).padStart(2, '0'))}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Side Nav (Center Aligned to Number Top) */}
                            <div className="absolute right-0 z-50 pointer-events-auto"
                                style={{ top: '384px', transform: 'translateY(-50%)' }}
                            >
                                <AboutSideNav
                                    sections={sections}
                                    activeIndex={isFooter ? sections.length : activeIndex}
                                    onSectionClick={performSnap} // Reuse snap logic
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
                                            {/* Title: Absolute at Title Baseline (Hardcoded 96px) */}
                                            <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ paddingTop: '96px' }}>
                                                <span className="text-[#2A4458] font-english font-bold text-sm tracking-widest uppercase mb-4 block">
                                                    {fastNormalize(section.title)}
                                                </span>
                                                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold font-korean text-[#05121C] leading-tight break-keep mb-12">
                                                    {fastNormalize(section.heading || section.title)}
                                                </h1>
                                            </div>

                                            {/* Body: Starts at Body Baseline (Hardcoded 384px) */}
                                            <div className="w-full pointer-events-auto" style={{ paddingTop: '384px' }}>
                                                <TableAlignmentProvider blocks={section.content}>
                                                    {groupGalleryBlocks(section.content).map((block) => (
                                                        <NotionRenderer
                                                            key={block.id}
                                                            block={block}
                                                            bodyClass={desktopBodyClass}
                                                        />
                                                    ))}
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
                            <div className="text-6xl font-korean font-bold text-[#2A4458]/20 mb-4">{fastNormalize(String(idx + 1).padStart(2, '0'))}</div>
                            <span className="text-sm font-bold text-[#2A4458] tracking-widest uppercase mb-2 block">{fastNormalize(section.title)}</span>
                            <h2 className="text-3xl font-korean font-bold text-[#05121C] mb-8 leading-tight">
                                {fastNormalize(section.heading || section.title)}
                            </h2>
                            <div className="prose font-korean text-gray-600">
                                <TableAlignmentProvider blocks={section.content}>
                                    {groupGalleryBlocks(section.content).map(block => (
                                        <NotionRenderer
                                            key={block.id}
                                            block={block}
                                        />
                                    ))}
                                </TableAlignmentProvider>
                            </div>
                        </div>
                    ))}
                    <Footer siteSettings={siteSettings} />
                </div>
            </div>
        </div>
    );
};

export default AboutPresentation;
