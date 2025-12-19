'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import { renderVerseWithStyledFirstWord } from '../../lib/utils/textUtils';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';
import NotionRenderer, { TableAlignmentProvider } from '../sermon/NotionRenderer';
import RightPanelMap from '../visit/RightPanelMap';
import Image from 'next/image';

// Internal Scripture Panel Component
// Renders a list of verses.
// Internal Scripture Panel Component
// Renders a list of verses.
const ScripturePanel = ({ verses, title, uniqueKey, contentPaddingClass = "pt-96" }) => {
    const { desktopVerseClass } = useFontScale();

    return (
        <div className={`w-full border-l border-[#2A4458]/10 flex flex-col items-center h-full ${contentPaddingClass} overflow-hidden`}>
            {verses && verses.length > 0 ? (
                <div className="space-y-12 w-full max-w-[60%] pointer-events-auto">
                    <AnimatePresence mode="wait">
                        {verses.map((tag, idx) => (
                            <motion.div
                                key={`${uniqueKey}-${idx}`}
                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                    delay: idx * 0.1
                                }}
                            >
                                <p className={`${desktopVerseClass} mb-4 break-keep`}>
                                    {renderVerseWithStyledFirstWord(tag.text || "(Verse not found: " + tag.reference + ")")}
                                </p>
                                <p className="text-base text-[#2A4458] font-bold text-right font-pretendard">
                                    {tag.reference}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center opacity-30 -mt-32">
                    <p className="text-[#2A4458] font-yisunshin text-2xl">SOLA SCRIPTURA</p>
                </div>
            )}
        </div>
    );
};

/**
 * RightPanelController
 * 
 * Manages the Fixed Right Panel.
 * Handles visibility transitions and content switching.
 * 
 * Props:
 * - isVisible: boolean (controls opacity/Y of the entire panel)
 * - mode: 'scripture' | 'map' | 'image' | 'verse' | 'page' | 'custom'
 * - data: content data for the mode (verses array, map coords {x,y}, image URL, or Notion blocks)
 * - section: full section object (optional, for title/fallback)
 * - title: optional title for ghost alignment
 * - titleClassName: optional class override for the ghost title
 * - paddingTopClass: optional padding class for the container's ghost title (default pt-24)
 * - contentPaddingClass: optional padding class for the content (default pt-96)
 * - uniqueKey: unique identifier for the content section (forces re-render animation)
 */
export const RightPanelController = ({
    isVisible,
    mode = 'scripture',
    data,
    section,
    title,
    titleClassName = "text-5xl md:text-6xl font-bold font-yisunshin leading-tight break-keep",
    paddingTopClass = "pt-24",
    contentPaddingClass = "pt-96",
    uniqueKey = "default"
}) => {
    const { desktopBodyClass } = useFontScale();
    return (
        <motion.div
            className="hidden md:flex fixed right-0 top-0 w-1/2 h-full flex-col items-center z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Buffer (Fixed Site Header) */}
            <div style={{ height: `${HEADER_HEIGHT_PX}px` }} className="w-full shrink-0" />

            <div className="w-full relative flex-1">
                {/* Content Layer (Exactly at Baseline) */}
                <div className="w-full h-full">
                    {mode === 'scripture' && (
                        <ScripturePanel
                            verses={data}
                            title={title}
                            uniqueKey={uniqueKey}
                            contentPaddingClass={contentPaddingClass}
                        />
                    )}

                    {mode === 'page' && data && (
                        <div className="w-full h-full overflow-y-auto no-scrollbar border-l border-[#2A4458]/10 pt-0">
                            <div className="min-h-full p-8 lg:p-16 flex flex-col justify-center">
                                <div className="prose font-korean text-gray-800 w-full">
                                    <TableAlignmentProvider blocks={data}>
                                        {data.map(block => (
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
                    )}

                    {mode === 'image' && data && (
                        <div className="w-full h-full border-l border-[#2A4458]/10 flex flex-col items-center justify-center px-8 lg:px-16 overflow-hidden">
                            <div className="relative w-full h-full max-h-[60vh] rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src={data}
                                    alt={title || "Section Image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'map' && data && (
                        <div className="w-full h-full border-l border-[#2A4458]/10 flex flex-col items-center justify-center">
                            <RightPanelMap
                                x={data.x}
                                y={data.y}
                                title={title}
                            />
                        </div>
                    )}

                    {mode === 'verse' && (
                        <div className="w-full h-full border-l border-[#2A4458]/10 flex flex-col items-center justify-center">
                            <div className="p-8 lg:p-16 text-center font-korean font-light text-2xl text-gray-800 break-keep leading-relaxed w-full max-w-md">
                                <p className="mb-6">&quot;말씀이 육신이 되어 우리 가운데 거하시매...&quot;</p>
                                <span className="block text-sm text-[#2A4458] font-bold">요한복음 1:14</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
