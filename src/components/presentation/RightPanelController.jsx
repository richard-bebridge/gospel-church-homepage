'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';
import NotionRenderer, { TableAlignmentProvider } from '../sermon/NotionRenderer';
import RightPanelMap from '../visit/RightPanelMap';
import Image from 'next/image';
import VerseList from './VerseList';
import { CURRENT_TEXT } from '../../lib/typography-tokens';

/**
 * RightPanelController
 */
export const RightPanelController = ({
    isVisible,
    mode = 'scripture',
    data,
    section,
    title,
    titleClassName = "text-5xl md:text-6xl font-bold font-korean leading-tight break-keep",
    paddingTopClass = "pt-24",
    contentPaddingClass = "pt-96",
    uniqueKey = "default",
    sectionIndex = 0,
    onWheel,
    verseClassName, // Optional override from parent
    verseStyle = {}, // Receive from parent (inline style for font scaling)
    bodyClassName // New: Receive from parent for sync
}) => {
    // Use internal hook as fallback, but prefer props
    const { desktopBodyClass: hookBodyClass, desktopVerseClass } = useFontScale();

    // Effective classes: Prop > Hook
    const effectiveBodyClass = bodyClassName || hookBodyClass;
    const effectiveVerseClass = verseClassName || desktopVerseClass;

    const interactionClass = isVisible ? 'pointer-events-auto' : 'pointer-events-none';

    // Dynamic container width - Standardized to avoid layout shifts
    const getContainerClass = (baseClasses, isWide = false) => {
        // Use max-w-lg for text-only content, max-w-[840px] for tables/grids
        const widthClass = isWide ? 'max-w-[840px]' : 'max-w-lg';
        return `${baseClasses} w-full ${widthClass} px-8 mx-auto`;
    };

    // Helper to detect if blocks contain elements requiring wide layout
    const hasWideContent = (blocks) => {
        if (!blocks || !Array.isArray(blocks)) return false;
        return blocks.some(b =>
            b.type === 'table' ||
            b.type === 'column_list' ||
            // Also check for nested tables in column lists if needed, but top-level check usually suffices
            (b.type === 'toggle' && hasWideContent(b.children))
        );
    };

    return (
        <motion.div
            className="hidden md:flex absolute right-0 top-0 w-1/2 h-full flex-col items-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Buffer */}
            <div style={{ height: `${HEADER_HEIGHT_PX}px` }} className="w-full shrink-0" />

            <div className="w-full relative flex-1 min-h-0">
                {(mode === 'scripture' || mode === 'verse') && (
                    <div className={`absolute inset-0 z-10 w-full flex flex-col pointer-events-none`}>
                        <div
                            className={`w-full h-full ${contentPaddingClass} overflow-y-auto no-scrollbar ${interactionClass} flex flex-col items-center justify-center`}
                        // Wheel listener removed - relying on native event bubbling via PresentationShell layout refactor
                        >
                            {/* Header Buffer Removed - using paddingTop instead for correct centering space */}
                            {data && data.length > 0 ? (
                                <VerseList
                                    verses={data}
                                    uniqueKey={`${uniqueKey}-scripture`}
                                    containerClassName={getContainerClass('space-y-12', false)}
                                    verseClassName={`${effectiveVerseClass} mb-4 break-keep whitespace-pre-wrap`}
                                    verseStyle={verseStyle}
                                    referenceClassName={CURRENT_TEXT.verse_reference}
                                    transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                                />
                            ) : (
                                isVisible && (
                                    <div className="h-full flex items-center justify-center opacity-30 -mt-32">
                                        <p className="text-[#2A4458] font-korean text-2xl">SOLA SCRIPTURA</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}


                <AnimatePresence mode="wait">
                    {mode === 'page' && data && (
                        <motion.div
                            key={`${uniqueKey}-page`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                            className="w-full h-full pt-0 pointer-events-none flex flex-col"
                        >
                            <div
                                className={`w-full h-full overflow-y-auto no-scrollbar ${interactionClass} flex flex-col`}
                            >
                                <div className={getContainerClass(`flex flex-col my-auto ${interactionClass} ${hasWideContent(data) ? 'p-8 lg:p-16' : 'px-6'}`, hasWideContent(data))}>
                                    <div className={`prose prose-lg max-w-none font-korean text-gray-800 w-full ${!hasWideContent(data) ? 'text-center' : ''}`}>
                                        <TableAlignmentProvider blocks={data}>
                                            {data.map(block => (
                                                <NotionRenderer
                                                    key={block.id}
                                                    block={block}
                                                    bodyClass={effectiveBodyClass}
                                                />
                                            ))}
                                        </TableAlignmentProvider>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'image' && data && (
                        <motion.div
                            key={`${uniqueKey}-image`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                            className="w-full h-full flex flex-col items-center justify-center px-8 lg:px-16 overflow-hidden pointer-events-none"
                        >
                            <div
                                className={`relative w-full h-full max-h-[60vh] rounded-lg overflow-hidden shadow-xl ${interactionClass}`}
                            >
                                <Image
                                    src={data}
                                    alt={title || "Section Image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    )}

                    {mode === 'map' && data && (
                        <motion.div
                            key={`${uniqueKey}-map`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                            className={`w-full h-full flex flex-col items-center justify-center ${interactionClass}`}
                        >
                            <RightPanelMap
                                x={data.x}
                                y={data.y}
                                title={title}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </motion.div >
    );
};
