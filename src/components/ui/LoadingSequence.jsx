'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waitForFonts, checkFontsReadySync } from '../../lib/utils/fontLoader';

const WORDS = ["seek.", "stand.", "rise.", "radiate."];
const WORD_DURATION = 800;
const FONT_SPECS = ['700 30px Montserrat'];

const LoadingSequence = () => {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isFontReady, setIsFontReady] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Run check on client mount
        if (checkFontsReadySync(FONT_SPECS)) {
            setIsFontReady(true);
        } else {
            waitForFonts(FONT_SPECS).then(() => {
                setIsFontReady(true);
            });
        }

        // Buffer text rendering by 100ms to ensure hydration is settled
        const textTimer = setTimeout(() => setShowText(true), 100);
        return () => clearTimeout(textTimer);
    }, []);

    useEffect(() => {
        if (!isFontReady || !showText) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % WORDS.length);
        }, WORD_DURATION);

        return () => clearInterval(timer);
    }, [isFontReady, showText]);

    // suppressHydrationWarning is added to the container to handle 
    // any unavoidable timing discrepancies in the first few frames.
    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#F4F3EF]"
            suppressHydrationWarning
        >
            {isClient && isFontReady && showText && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-2xl md:text-3xl font-bold text-[#05121C] font-montserrat uppercase"
                    >
                        {WORDS[index]}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default LoadingSequence;
