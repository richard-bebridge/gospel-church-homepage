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
    uniqueKey = "default"
}) => {
    const { desktopBodyClass, desktopVerseClass } = useFontScale();
    return (
        <motion.div
            className="hidden md:flex fixed right-0 top-0 w-1/2 h-full flex-col items-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Buffer */}
            <div style={{ height: `${HEADER_HEIGHT_PX}px` }} className="w-full shrink-0" />

            <div className="w-full relative flex-1">
                {(mode === 'scripture' || mode === 'verse') && (
                    <div className={`w-full border-l border-[#2A4458]/10 flex flex-col items-center h-full ${contentPaddingClass} overflow-hidden`}>
                        {data && data.length > 0 ? (
                            <VerseList
                                verses={data}
                                uniqueKey={`${uniqueKey}-scripture`}
                                containerClassName="space-y-12 w-full max-w-[520px] px-8 pointer-events-auto"
                                verseClassName={`${desktopVerseClass} mb-4 break-keep`}
                                referenceClassName={CURRENT_TEXT.verse_reference}
                                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center opacity-30 -mt-32">
                                <p className="text-[#2A4458] font-korean text-2xl">SOLA SCRIPTURA</p>
                            </div>
                        )}
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
                            className="w-full h-full overflow-y-auto no-scrollbar border-l border-[#2A4458]/10 pt-0 pointer-events-auto"
                        >
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
                        </motion.div>
                    )}

                    {mode === 'image' && data && (
                        <motion.div
                            key={`${uniqueKey}-image`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                            className="w-full h-full border-l border-[#2A4458]/10 flex flex-col items-center justify-center px-8 lg:px-16 overflow-hidden pointer-events-auto"
                        >
                            <div className="relative w-full h-full max-h-[60vh] rounded-lg overflow-hidden shadow-xl">
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
                            className="w-full h-full border-l border-[#2A4458]/10 flex flex-col items-center justify-center pointer-events-auto"
                        >
                            <RightPanelMap
                                x={data.x}
                                y={data.y}
                                title={title}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
