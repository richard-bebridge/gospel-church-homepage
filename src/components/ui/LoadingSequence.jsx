'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waitForFonts } from '../../lib/utils/fontLoader';

const WORDS = ["Seek", "Stand", "Transform", "Radiate"];
const WORD_DURATION = 600; // Unified duration
const FONT_SPECS = ['700 30px Montserrat'];

const LoadingSequence = () => {
    const [wordIndex, setWordIndex] = useState(0);
    const [isFontReady, setIsFontReady] = useState(false);
    const instanceId = React.useRef(Math.random().toString(36).substr(2, 5));

    useEffect(() => {
        console.log(`[LoadingSequence:${instanceId.current}] MOUNT`, performance.now());
        const init = async () => {
            await waitForFonts(FONT_SPECS);
            setIsFontReady(true);
        };
        init();
        return () => console.log(`[LoadingSequence:${instanceId.current}] UNMOUNT`, performance.now());
    }, []);

    useEffect(() => {
        if (!isFontReady) return;

        console.log(`[LoadingSequence:${instanceId.current}] START_INTERVAL`, performance.now());

        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % WORDS.length);
        }, 600); // Unified with IntroOverlay (600ms)

        return () => {
            console.log(`[LoadingSequence:${instanceId.current}] STOP_INTERVAL`, performance.now());
            clearInterval(interval);
        };
    }, [isFontReady]);

    // Log word changes in a dedicated effect
    useEffect(() => {
        console.log(`[LoadingSequence:${instanceId.current}] INDEX: ${wordIndex}`, performance.now());
    }, [wordIndex]);

    // Explicit metrics + Antialiasing enforcement
    const typoStyle = {
        lineHeight: '1',
        letterSpacing: '-0.02em',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-[#F4F3EF] flex items-center justify-center pointer-events-none">
            <div className="relative overflow-hidden h-16 w-full flex justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={wordIndex}
                        id="loading-text-span"
                        className={`text-2xl md:text-3xl font-bold font-sans text-[#05121C] uppercase absolute antialiased transition-opacity duration-300
                            ${isFontReady ? 'opacity-100' : 'opacity-0'}
                        `}
                        style={typoStyle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isFontReady ? 1 : 0, y: 0 }}
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
