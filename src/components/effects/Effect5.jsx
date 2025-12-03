import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyVerses } from '../../data/verses';

const Effect5 = ({ activeSection }) => {
    const verses = useMemo(() => getDailyVerses(), []);
    const currentVerse = verses[activeSection % verses.length];

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-[#F4F3EF] overflow-hidden">
            {/* 
                SVG Filter from CodePen 
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            */}
            <svg className="absolute hidden">
                <defs>
                    <filter id="threshold">
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 255 -140"
                        />
                    </filter>
                </defs>
            </svg>

            {/* 
                Container with the filter applied.
                CodePen: filter: url(#threshold) blur(0.6px);
            */}
            <div
                className="relative w-full max-w-xl h-64 flex items-center justify-center"
                style={{ filter: 'url(#threshold) blur(0.6px)' }}
            >
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeSection}
                        className="absolute w-full text-center px-12"
                        initial={{ opacity: 0, filter: 'blur(80px)' }}
                        animate={{
                            opacity: 1,
                            filter: 'blur(1px)',
                            transition: {
                                duration: 2.5,
                                ease: "easeInOut"
                            }
                        }}
                        exit={{
                            opacity: 0,
                            filter: 'blur(80px)',
                            transition: {
                                duration: 2.0,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        <div className="font-sans font-bold text-2xl xl:text-3xl leading-relaxed tracking-wide text-[#1F1D20]">
                            {currentVerse.text}
                        </div>
                        <div className="text-xs font-bold tracking-[0.2em] uppercase mt-6 font-mono text-gray-400">
                            {currentVerse.ref}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute top-4 right-4 text-xs font-mono text-gray-300">
                MODE: 5 (CODEPEN MORPH)
            </div>
        </div>
    );
};

export default Effect5;
