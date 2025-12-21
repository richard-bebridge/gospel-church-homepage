'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waitForFonts, checkFontsReadySync } from '../../lib/utils/fontLoader';

const WORDS = ["seek.", "stand.", "rise.", "radiate."];
const WORD_DURATION = 800;
const FONT_SPECS = ['700 30px Montserrat'];

const LoadingSequence = ({ isReady = false }) => {
    const [index, setIndex] = useState(0);
    const [isFontReady, setIsFontReady] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        let isMounted = true;

        const initFonts = async () => {
            const ready = await waitForFonts(FONT_SPECS);
            if (isMounted) {
                setIsFontReady(ready);
            }
        };
        initFonts();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % WORDS.length);
        }, WORD_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {!isReady && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-[#F4F3EF]"
                >
                    {isClient && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={`text-2xl md:text-3xl font-bold text-[#05121C] font-montserrat uppercase transition-opacity duration-200 ${isFontReady ? 'opacity-100' : 'opacity-0'}`}
                            >
                                {WORDS[index]}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingSequence;
