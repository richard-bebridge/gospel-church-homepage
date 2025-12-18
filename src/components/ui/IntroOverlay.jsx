'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ["Seek", "Stand", "Transform", "Radiate"];
const WORD_DURATION = 600; // ms per word

const IntroOverlay = ({ onComplete }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Cycle through words
        const interval = setInterval(() => {
            setIndex(prev => {
                if (prev >= WORDS.length - 1) {
                    clearInterval(interval);
                    // Delay slightly before calling complete to allow last word to be seen
                    setTimeout(() => {
                        onComplete && onComplete();
                    }, WORD_DURATION);
                    return prev;
                }
                return prev + 1;
            });
        }, WORD_DURATION);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#F4F3EF] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="relative overflow-hidden h-20 w-full flex justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        className="text-3xl md:text-4xl font-sans font-bold text-[#05121C] uppercase absolute tracking-widest"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {WORDS[index]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default IntroOverlay;
