import React, { useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { getDailyVerses } from '../data/verses';
import { Instagram, Youtube, Facebook, Sunrise } from 'lucide-react';

const RightPanel = ({ activeSection }) => {
    // --- CONFIGURATION ---
    const verticalOffset = 0;      // Moves text Up (negative) or Down (positive) in pixels.

    // "Clear Zone": The area in the center where text is fully visible.
    // 0% (Top) -> clearZoneStart (Fade In) -> clearZoneEnd (Fade Out) -> 100% (Bottom)
    // IMPORTANT: These two numbers MUST be different. The gap between them is where you can read.
    const clearZoneStart = '45%';  // Try 10% - 30%. (Smaller = More text visible at top)
    const clearZoneEnd = '55%';    // Try 70% - 90%. (Larger = More text visible at bottom)

    const scrollSpeed = 0.8;       // 0.5 = Slow, 1.0 = Normal, 1.2 = Fast.
    // ---------------------

    // Get daily shuffled verses
    const dailyVerses = useMemo(() => getDailyVerses(), []);

    // Duplicate verses heavily to ensure full screen coverage and infinite scroll feel
    const streamVerses = useMemo(() => [...dailyVerses, ...dailyVerses, ...dailyVerses, ...dailyVerses, ...dailyVerses, ...dailyVerses], [dailyVerses]);

    // Continuous Scroll Sync
    const { scrollY } = useScroll();

    // Map Window Scroll (scrollY) to Verse Scroll (y)
    // Factor 0.8 means verses move at 80% of scroll speed (parallax effect)
    const rawY = useTransform(scrollY, (value) => (-value * scrollSpeed) + verticalOffset);

    // Smooth out the movement for a "meditative" feel
    const smoothY = useSpring(rawY, { stiffness: 30, damping: 40, mass: 1.5 });

    // Determine if we are in the footer section (last section)
    // Assuming 5 sections (0-4) + Footer (5)
    const isFooter = activeSection === 5;

    // Format today's date
    const today = new Date();
    const dateString = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div
            className={`hidden lg:flex w-1/2 sticky top-24 h-[calc(100vh-6rem)] items-center justify-center overflow-hidden border-l border-gray-200 relative transition-colors duration-1000 ${isFooter ? 'bg-[#05121C]' : 'bg-[#F4F3EF]'
                }`}
        >

            {/* Verses Container - Fades out in Footer */}
            {/* CSS Mask applied to this wrapper so overlay stays sharp */}
            <div
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                    maskImage: `linear-gradient(to bottom, transparent 0%, black ${clearZoneStart}, black ${clearZoneEnd}, transparent 100%)`,
                    WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${clearZoneStart}, black ${clearZoneEnd}, transparent 100%)`
                }}
            >
                {/* <motion.div
                    className="relative w-full flex flex-col items-center gap-6 transition-opacity duration-1000"
                    style={{
                        y: smoothY,
                        opacity: isFooter ? 0 : 1,
                    }}
                >
                    {streamVerses.map((verse, i) => {
                        return (
                            <motion.div
                                key={i}
                                className="w-full text-center px-16"
                            >
                                <motion.div
                                    className="font-sans font-medium text-xl xl:text-2xl leading-relaxed tracking-wide text-[#05121C]"
                                >
                                    {verse.text}
                                </motion.div>

                                <motion.div
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase mt-2 mb-8 font-mono text-gray-400"
                                >
                                    {verse.ref}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div> */}
            </div>

            {/* Footer Slogan & Social - Fades in in Footer */}
            <div className={`absolute inset-0 flex flex-col justify-center items-end px-24 transition-opacity duration-1000 ${isFooter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-end gap-8">
                    <h2 className="font-sans font-bold text-5xl md:text-6xl leading-tight text-white uppercase tracking-widest text-right">
                        Seek.<br />
                        Stand.<br />
                        Transform.<br />
                        Radiate.
                    </h2>

                    <div className="flex gap-6">
                        <a href="#" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Instagram className="w-8 h-8" />
                        </a>
                        <a href="#" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Youtube className="w-8 h-8" />
                        </a>
                        <a href="#" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Facebook className="w-8 h-8" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Overlay Box - Bottom Right (Hidden in Footer) */}
            {/* Redesigned: Horizontal, Blue, Icon, Sharp (No Blur) */}
            {/*
            <div className={`absolute bottom-5 right-5 z-20 transition-opacity duration-500 ${isFooter ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-6 text-[#05121C]">

                    <div className="flex items-center gap-6">
                        <span className="font-sans font-medium text-base tracking-widest">{dateString}</span>
                        <span className="font-sans font-medium text-base tracking-widest uppercase">The Nature of Love</span>
                    </div>
                </div>
            </div>
            */}
        </div>
    );
};

export default RightPanel;
