'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFontScale } from '../../hooks/sermon/useFontScale';
import { renderVerseWithStyledFirstWord } from '../../lib/utils/textUtils';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';

// Internal Scripture Panel Component
// Renders a list of verses.
const ScripturePanel = ({ verses, title }) => {
    const { desktopVerseClass } = useFontScale();

    return (
        <div className="w-full border-l border-[#2A4458]/10 flex flex-col items-center h-full pt-32 overflow-hidden">
            {verses && verses.length > 0 ? (
                <div className="space-y-12 w-full max-w-[60%] pointer-events-auto">
                    <AnimatePresence>
                        {verses.map((tag, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
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
 * - mode: 'scripture' | 'map' | 'custom'
 * - data: content data for the mode (e.g. verses array)
 * - title: optional title for ghost alignment
 * - titleClassName: optional class override for the ghost title
 * - paddingTopClass: optional padding class for the container (default pt-24 pb-12)
 */
export const RightPanelController = ({
    isVisible,
    mode = 'scripture',
    data,
    title,
    titleClassName = "text-5xl md:text-6xl font-bold font-yisunshin leading-tight break-keep",
    paddingTopClass = "pt-24 pb-12"
}) => {
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
            {/* Header Buffer */}
            <div style={{ height: `${HEADER_HEIGHT_PX}px` }} className="w-full shrink-0" />

            {/* Ghost Header for Alignment (Invisible) */}
            {/* Ensures content starts exactly aligned with Left Panel text */}
            <div className={`w-full flex flex-col items-center opacity-0 ${paddingTopClass}`}>
                <div className="w-full max-w-[60%]">
                    <h1 className={titleClassName}>
                        {title || "Ghost Title"}
                    </h1>
                </div>
            </div>

            {/* Content Switch */}
            {mode === 'scripture' && <ScripturePanel verses={data} title={title} />}
        </motion.div>
    );
};
