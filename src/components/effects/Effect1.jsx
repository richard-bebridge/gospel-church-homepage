import React, { useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { getKoreanVerses } from '../../data/koreanVerses';

const Effect1 = ({ activeSection }) => {
    // --- CONFIGURATION ---
    const verticalOffset = 0;
    const clearZoneStart = '45%';
    const clearZoneEnd = '55%';
    const scrollSpeed = 0.8;
    // ---------------------

    const verses = useMemo(() => getKoreanVerses(50), []); // Get 50 random verses
    const streamVerses = useMemo(() => [...verses, ...verses, ...verses], [verses]);

    const { scrollY } = useScroll();
    const rawY = useTransform(scrollY, (value) => (-value * scrollSpeed) + verticalOffset);
    const smoothY = useSpring(rawY, { stiffness: 30, damping: 40, mass: 1.5 });

    return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                    maskImage: `linear-gradient(to bottom, transparent 0%, black ${clearZoneStart}, black ${clearZoneEnd}, transparent 100%)`,
                    WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${clearZoneStart}, black ${clearZoneEnd}, transparent 100%)`
                }}
            >
                <motion.div
                    className="relative w-full px-8 md:px-12"
                    style={{ y: smoothY }}
                >
                    <p className="font-korean font-light text-lg xl:text-xl leading-relaxed tracking-wide text-[#E6E1D3] text-justify break-keep">
                        {streamVerses.map(v => v.text).join(' ')}
                    </p>
                </motion.div>
            </div>

            <div className="absolute top-4 right-4 text-xs font-mono text-gray-300">
                MODE: 1 (KOREAN)
            </div>
        </div>
    );
};

export default Effect1;
