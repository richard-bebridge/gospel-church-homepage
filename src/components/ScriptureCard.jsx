'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { CURRENT_TEXT } from '../lib/typography-tokens';

// Prevent widow lines by adding non-breaking space between last two words
const preventWidow = (text) => {
    if (!text) return text;
    const words = text.trim().split(' ');
    if (words.length < 2) return text;
    const lastTwo = words.slice(-2).join('\u00A0'); // non-breaking space
    return [...words.slice(0, -2), lastTwo].join(' ');
};

const ScriptureCard = ({ headlineEn, bodyKo, reference, animate = true, className = "" }) => {
    const cardContent = (
        <div className="w-full max-w-[480px] min-h-[260px] md:min-h-[300px] flex flex-col justify-center px-4">
            {/* Korean Body */}
            <div className={`${CURRENT_TEXT.home_verse_text} whitespace-pre-line`}>
                {preventWidow(bodyKo)}
            </div>

            <br />

            {/* Reference */}
            <div className={`self-end ${CURRENT_TEXT.home_verse_reference}`}>
                {reference}
            </div>
        </div>
    );

    // Return with or without animation wrapper
    if (!animate) {
        return <div className={className}>{cardContent}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.55, filter: 'blur(40px)' }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
        >
            {cardContent}
        </motion.div>
    );
};

export default ScriptureCard;
