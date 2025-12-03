import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyVerses } from '../../data/verses';

const Effect4 = ({ activeSection }) => {
    const verses = useMemo(() => getDailyVerses(), []);
    const currentVerse = verses[activeSection % verses.length];

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden">
            {/* 
                Liquid Effect Container
                - contrast(20): High contrast to sharpen the blurred elements, creating the "gooey" liquid look.
                - background: black
            */}
            <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                    filter: 'contrast(20)'
                }}
            >

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        variants={{
                            initial: { y: '100%', opacity: 0, filter: 'blur(20px)' },
                            animate: {
                                y: '0%', opacity: 1, filter: 'blur(0px)',
                                transition: { duration: 9.0, ease: [0.22, 1, 0.36, 1] }
                            },
                            exit: {
                                y: '100%', opacity: 0, filter: 'blur(20px)',
                                transition: { duration: 0.1, ease: "easeInOut" }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="max-w-3xl text-center px-24 z-10"
                    >
                        {/* 
                            We apply the blur to the text wrapper or individual text for the liquid effect.
                            However, since we want the text to "sharpen" as it arrives, we animate the blur.
                        */}
                        <div className="font-sans font-bold text-4xl md:text-6xl leading-tight tracking-tight text-white mix-blend-screen">
                            {currentVerse.text}
                        </div>
                        <div className="text-sm font-bold tracking-[0.3em] uppercase mt-12 font-mono text-gray-400">
                            {currentVerse.ref}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 z-20 mix-blend-difference">
                MODE: 4 (LIQUID RISE)
            </div>
        </div>
    );
};

export default Effect4;
