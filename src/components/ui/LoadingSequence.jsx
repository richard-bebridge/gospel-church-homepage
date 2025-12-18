'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ["Seek", "Stand", "Transform", "Radiate"];

const LoadingSequence = () => {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        // Simple loop every 400ms for a brisk pace
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % WORDS.length);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#F4F3EF] flex items-center justify-center pointer-events-none">
            <div className="relative overflow-hidden h-16 w-full flex justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={wordIndex}
                        className="text-2xl md:text-3xl font-sans font-bold text-[#05121C] uppercase absolute"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        {WORDS[wordIndex]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LoadingSequence;
