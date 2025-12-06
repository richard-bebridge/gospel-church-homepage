import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Prevent widow lines by adding non-breaking space between last two words
const preventWidow = (text) => {
    if (!text) return text;
    const words = text.trim().split(' ');
    if (words.length < 2) return text;
    const lastTwo = words.slice(-2).join('\u00A0'); // non-breaking space
    return [...words.slice(0, -2), lastTwo].join(' ');
};

const ScriptureCard = ({ headlineEn, bodyKo, reference, animate = true }) => {
    const cardContent = (
        <div className="w-full max-w-[320px] min-h-[260px] md:min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 md:space-y-8 px-4">
            {/* English Headline */}
            <div className="text-balance break-keep font-sans font-light text-xl md:text-2xl tracking-wide leading-snug text-[#05121C] whitespace-pre-line">
                {preventWidow(headlineEn)}
            </div>

            <br />

            {/* Korean Body */}
            <div className="text-balance break-keep font-korean font-light text-xl md:text-2xl leading-relaxed text-[#05121C] whitespace-pre-line">
                {preventWidow(bodyKo)}
            </div>

            <br />

            {/* Reference */}
            <div className="flex items-center gap-3 cursor-pointer group">
                {/* <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A4458] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /> */}
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wide text-[#2A4458] uppercase">{reference}</span>
            </div>
        </div>
    );

    // Return with or without animation wrapper
    if (!animate) {
        return cardContent;
    }

    return (
        <motion.div
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
