import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyVerses } from '../../data/verses';

const Effect2 = ({ activeSection }) => {
    const verses = useMemo(() => getDailyVerses(), []);

    // Select a verse based on the active section (modulo to loop if sections > verses)
    const currentVerse = verses[activeSection % verses.length];

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-[#F4F3EF] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection} // Triggers animation when section changes
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.55, filter: 'blur(40px)' }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    className="max-w-xl text-center px-12"
                >
                    <div className="font-sans font-medium text-xl xl:text-2xl leading-relaxed tracking-wide text-[#05121C]">
                        {currentVerse.text}
                    </div>
                    <div className="font-korean font-light text-lg xl:text-xl leading-relaxed mt-4 text-[#2A4458]">
                        {currentVerse.textKo}
                    </div>
                    <div className="text-sm font-medium tracking-[0.2em] uppercase mt-6 font-mono text-[#2A4458]">
                        {currentVerse.ref}
                    </div>
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default Effect2;
