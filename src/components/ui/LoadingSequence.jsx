'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waitForFonts, checkFontsReadySync } from '../../lib/utils/fontLoader';

const WORDS = ["seek.", "stand.", "rise.", "radiate."];
const WORD_DURATION = 800;
const FONT_SPECS = ['700 30px Montserrat'];

const LoadingSequence = () => {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isFontReady, setIsFontReady] = useState(false);

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
    }, []);

    useEffect(() => {
        if (!isFontReady) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % WORDS.length);
        }, WORD_DURATION);

        return () => clearInterval(timer);
    }, [isFontReady]);

    // Always render the EXACT same container for server/client hydration
    // to avoid block-level or style-level mismatches.
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#F4F3EF]">
            {isClient && isFontReady && (
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
