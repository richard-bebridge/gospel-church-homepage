'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { renderVerseWithStyledFirstWord } from '../../lib/utils/textUtils';
import { fastNormalize } from '../../lib/utils/textPipeline';

/**
 * VerseList
 *
 * Centralized animated renderer for scripture references.
 * Keeps typography/animation consistent across pages.
 */
const VerseList = ({
    verses = [],
    uniqueKey = 'verses',
    containerClassName = '',
    verseClassName = '',
    verseStyle = {},  // NEW: inline style for font scaling
    referenceClassName = '',
    animate = true,
    transition = { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
}) => {
    if (!verses || verses.length === 0) {
        return null;
    }

    const renderList = () => (
        <div className={containerClassName}>
            {verses.map((verse, idx) => (
                <motion.div
                    key={`${uniqueKey}-${idx}`}
                    variants={{
                        initial: { opacity: 0, y: 16 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -16 }
                    }}
                    className="space-y-2"
                >
                    <p className={verseClassName} style={verseStyle}>
                        {renderVerseWithStyledFirstWord(verse.text || `(Verse not found: ${verse.reference})`)}
                    </p>
                    <p className={referenceClassName}>{fastNormalize(verse.reference)}</p>
                </motion.div>
            ))}
        </div>
    );

    if (!animate) {
        return renderList();
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={uniqueKey}
                variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: {
                        opacity: 1,
                        y: 0,
                    },
                    exit: { opacity: 0, y: -20 }
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ ...transition, staggerChildren: 0.2, delayChildren: 0.05 }}
            >
                {renderList()}
            </motion.div>
        </AnimatePresence>
    );
};

export default VerseList;
