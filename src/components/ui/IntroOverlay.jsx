'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waitForFonts } from '../../lib/utils/fontLoader';

const WORDS = ["Seek", "Stand", "Transform", "Radiate"];
const WORD_DURATION = 600; // ms per word
const FONT_SPECS = ['700 30px Montserrat'];

const IntroOverlay = ({ onComplete }) => {
    const [index, setIndex] = useState(0);
    const [isFontReady, setIsFontReady] = useState(false);
    const instanceId = useRef(Math.random().toString(36).substr(2, 5));
    const completionTriggered = useRef(false);

    useEffect(() => {
        console.log(`[IntroOverlay:${instanceId.current}] MOUNT`, performance.now());
        const init = async () => {
            await waitForFonts(FONT_SPECS);
            setIsFontReady(true);
        };
        init();
        return () => console.log(`[IntroOverlay:${instanceId.current}] UNMOUNT`, performance.now());
    }, []);

    // 1. Core Interval (Pure)
    useEffect(() => {
        if (!isFontReady) return;

        // Log START_INTERVAL here, it will run once after isFontReady becomes true
        console.log(`[IntroOverlay:${instanceId.current}] START_INTERVAL at index ${index}`, performance.now());

        const interval = setInterval(() => {
            setIndex(prev => {
                if (prev >= WORDS.length) return prev;
                return prev + 1;
            });
        }, WORD_DURATION);

        return () => {
            console.log(`[IntroOverlay:${instanceId.current}] STOP_INTERVAL`, performance.now());
            clearInterval(interval);
        };
    }, [isFontReady]); // Only re-run when isFontReady changes

    // Log index changes in a dedicated effect to avoid doubled logs in Strict Mode updaters
    useEffect(() => {
        console.log(`[IntroOverlay:${instanceId.current}] INDEX: ${index}`, performance.now());
    }, [index]);

    // 2. Completion Monitor (Side Effect)
    useEffect(() => {
        if (index >= WORDS.length && !completionTriggered.current) {
            completionTriggered.current = true;
            console.log(`[IntroOverlay:${instanceId.current}] SEQUENCE_COMPLETE -> Triggering onComplete`, performance.now());

            // Short delay to show the final state/word before unmounting
            const timer = setTimeout(() => {
                console.log(`[IntroOverlay:${instanceId.current}] EXECUTING onComplete callback`);
                onComplete && onComplete();
            }, WORD_DURATION);

            return () => clearTimeout(timer);
        }
    }, [index, onComplete]);

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
                        className={`text-3xl md:text-4xl font-sans font-bold text-[#05121C] uppercase absolute tracking-widest transition-opacity duration-300 ${isFontReady ? 'opacity-100' : 'opacity-0'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isFontReady ? 1 : 0, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {WORDS[Math.min(index, WORDS.length - 1)]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default IntroOverlay;
