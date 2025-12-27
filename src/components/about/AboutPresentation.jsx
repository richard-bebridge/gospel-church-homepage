'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotionRenderer, { TableAlignmentProvider } from '../sermon/NotionRenderer';
import AboutSideNav from './AboutSideNav';
import Header from '../Header';
import Footer from '../Footer';
import FloatingMediaControls from '../sermon/FloatingMediaControls';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';
import { RightPanelController } from '../presentation/RightPanelController';
import { groupGalleryBlocks } from '../../lib/utils/notionBlockMerger';
import LoadingSequence from '../ui/LoadingSequence';
import Image from 'next/image';
import VerseList from '../presentation/VerseList';
import { waitForFonts } from '../../lib/utils/fontLoader';
import { fastNormalize } from '../../lib/utils/textPipeline';
import { useSnapScrollState } from '../../hooks/useSnapScroll';
import { CURRENT_TEXT } from '../../lib/typography-tokens';
import AutoScaleTitle from '../ui/AutoScaleTitle';

const hasWideContent = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return false;
    return blocks.some(b =>
        b.type === 'table' ||
        b.type === 'column_list' ||
        (b.type === 'toggle' && hasWideContent(b.children))
    );
};

const AboutPresentation = ({ sections, siteSettings }) => {
    // ----------------------------------------------------------------
    // Intro & Loading State
    // ----------------------------------------------------------------
    const [fontsReady, setFontsReady] = useState(false);
    const { fontScale, toggleFontScale, desktopBodyClass, desktopVerseClass, verseStyle, isSettled: fontScaleSettled } = useFontScale();

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

    const isReady = sections && sections.length > 0;

    // ----------------------------------------------------------------      
    // 1. State & Refs
    // ---------------------------------------------------------------- 
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const footerRef = useRef(null);

    const {
        activeIndex,
        isFooter,
        performSnap
    } = useSnapScrollState(sections, {
        containerRef,
        sectionRefs,
        footerRef
    });

    useEffect(() => {
        if (isReady && sections) {
            // Hash Navigation Handler
            const hash = window.location.hash;
            if (!hash) return;

            const targetSlug = hash.replace('#', '');
            const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const targetIndex = sections.findIndex(sec => {
                const titleSlug = toSlug(sec.title || "");
                const subtitleSlug = toSlug(sec.subtitle || ""); // Fallback if needed
                return titleSlug === targetSlug || subtitleSlug === targetSlug;
            });

            if (targetIndex !== -1) {
                // Small delay to ensure layout is stable
                setTimeout(() => {
                    performSnap(targetIndex);
                }, 100);
            }
        }
    }, [isReady, sections, performSnap]);

    // ----------------------------------------------------------------      
    // Data Render
    // ---------------------------------------------------------------- 

    // Right Panel Render
    const renderRightPanel = () => {
        if (!sections[activeIndex] || isFooter) return null;

        // Default to 0 if activeIndex is undefined or invalid to ensure initial render
        const currentIdx = (typeof activeIndex === 'number' && activeIndex >= 0) ? activeIndex : 0;
        const safeIndex = Math.min(currentIdx, sections.length - 1);
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
                section={section}
                contentPaddingClass="pt-32"
                sectionIndex={activeIndex}
                verseClassName={desktopVerseClass}
                verseStyle={verseStyle}
            />
        );
    };

    return (
        <div className="relative min-h-screen bg-[#F4F3EF] text-[#1A1A1A]">
            <LoadingSequence isReady={isReady} />

            {/* Header moved out to escape stacking context of the blurred wrapper */}
            <Header siteSettings={siteSettings} />

            {/* Structural stability: keep DOM identical during hydration */}
            <div
                className="transition-all duration-1000"
                style={{
                    opacity: isReady ? 1 : 0.5,
                    filter: isReady ? 'none' : 'blur(5px)',
                    pointerEvents: isReady ? 'auto' : 'none'
                }}
            >
                {/* Main Scroll Container */}
                <div
                    ref={containerRef}
                    className="hidden md:block absolute top-0 left-0 w-full h-screen overflow-y-auto snap-y snap-mandatory overscroll-y-none no-scrollbar"
                >
                    <div className="relative w-full bg-[#F4F3EF]">

                        {/* Sticky Foreground Layer */}
                        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-30">
                            {renderRightPanel()}

                            {/* Left Panel Decorative - Centered Sticky Elements */}
                            <div className="absolute left-0 top-0 w-1/2 h-full border-r border-[#2A4458]/10 pointer-events-none">
                                <div className="w-full h-full flex flex-col justify-center relative">
                                    {/* Sticky Number (Aligned with Center) */}
                                    <div className={`hidden min-[1600px]:flex absolute left-12 overflow-hidden h-[72px] w-[90px] items-start transition-opacity duration-300 ${isFooter ? 'opacity-0' : 'opacity-100'}`}
                                        style={{ top: '50%', transform: 'translateY(-50%)' }}
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
                            </div>

                            {/* Side Nav (Center Aligned) */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
                                <AboutSideNav
                                    sections={sections}
                                    activeIndex={isFooter ? sections.length : activeIndex}
                                    onSectionClick={performSnap}
                                />
                            </div>
                        </div>

                        {/* Sections (Behind Sticky Layer) */}
                        <div className="relative w-full">
                            {sections.map((section, index) => {
                                const processedBlocks = groupGalleryBlocks(section.content);
                                const isLong = (section.content?.length || 0) > 6;



                                return (
                                    <section
                                        key={section.id}
                                        ref={el => sectionRefs.current[index] = el}
                                        className={
                                            isLong
                                                ? "w-full h-screen snap-start relative overflow-y-auto no-scrollbar"
                                                : "w-full h-screen snap-start relative overflow-hidden flex flex-col"
                                        }
                                    >
                                        <div className="w-full max-w-[50%] ml-0 h-full relative border-r border-transparent">

                                            <div className={`w-full min-h-full flex flex-col items-center ${index === 0 ? 'justify-start pt-64' : 'justify-center pt-32'}`}>
                                                {/* Adjusted Width inside Left Panel */}
                                                <div className={`w-full relative ${hasWideContent(section.content) ? 'max-w-[80%] xl:max-w-[70%]' : 'max-w-lg'}`}>

                                                    {/* Title Block - Always flow layout */}
                                                    <div className="w-full mb-12">
                                                        <span className={CURRENT_TEXT.badge + " block mb-4"}>
                                                            {fastNormalize(section.title)}
                                                        </span>
                                                        <AutoScaleTitle
                                                            text={fastNormalize(section.heading || section.title)}
                                                            className={CURRENT_TEXT.page_title_ko + " mb-12"}
                                                            scales={['', 'text-[56px]', 'text-[48px]', 'text-[40px]', 'text-[32px]']}
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <TableAlignmentProvider blocks={section.content}>
                                                            {processedBlocks.map((block) => (
                                                                <NotionRenderer
                                                                    key={block.id}
                                                                    block={block}
                                                                    bodyClass={desktopBodyClass}
                                                                />
                                                            ))}
                                                        </TableAlignmentProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                );
                            })}

                            {/* Footer Section */}
                            <section
                                ref={footerRef}
                                className="w-full h-screen snap-start overflow-hidden relative flex flex-col justify-end"
                            >
                                <Footer siteSettings={siteSettings} />
                            </section>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden w-full bg-[#F4F3EF] pt-20">
                    {
                        sections.map((section, idx) => (
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

                                {/* Mobile Right Panel Content (Conditional) */}
                                {section.showRightPanelMobile && (
                                    <div className="mt-8 pt-8">
                                        {/* 1. Page Content */}
                                        {section.rightPanelType === 'page' && section.pageContent && (
                                            <div className="prose font-korean text-gray-600">
                                                <TableAlignmentProvider blocks={section.pageContent}>
                                                    {groupGalleryBlocks(section.pageContent).map(block => (
                                                        <NotionRenderer
                                                            key={block.id}
                                                            block={block}
                                                            bodyClass={desktopBodyClass}
                                                        />
                                                    ))}
                                                </TableAlignmentProvider>
                                            </div>
                                        )}

                                        {/* 2. Verse Content */}
                                        {(section.rightPanelType === 'verse' || section.rightPanelType === 'scripture') && section.scriptureTags && (
                                            <VerseList
                                                verses={section.scriptureTags}
                                                verseClassName={`${CURRENT_TEXT.verse_text} mb-4`}
                                                referenceClassName={CURRENT_TEXT.verse_reference}
                                                animate={false}
                                                containerClassName="space-y-8"
                                            />
                                        )}

                                        {/* 3. Image Content */}
                                        {(section.rightPanelType === 'image' || (!section.rightPanelType && section.imgSrc)) && section.imgSrc && (
                                            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg mt-4">
                                                <Image
                                                    src={section.imgSrc}
                                                    alt={section.title || "Section Image"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    }
                    <Footer siteSettings={siteSettings} />
                </div>

                {/* Floating Font Controls */}
                <FloatingMediaControls
                    footerRef={footerRef}
                    fontScale={fontScale}
                    onToggleFontScale={toggleFontScale}
                    shareTitle="About Gospel Church"
                />
            </div>
        </div>
    );
};

export default AboutPresentation;
