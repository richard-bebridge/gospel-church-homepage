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
                    <div className="font-sans font-medium text-2xl xl:text-3xl leading-relaxed tracking-wide text-[#05121C]">
                        {currentVerse.text}
                    </div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase mt-6 font-mono text-gray-400">
                        {currentVerse.ref}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute top-4 right-4 text-xs font-mono text-gray-300">
                MODE: 2 (APPEAR/DISAPPEAR)
            </div>
        </div>
    );
};

export default Effect2;
