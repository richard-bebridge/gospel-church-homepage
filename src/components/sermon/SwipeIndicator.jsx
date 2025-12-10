'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SwipeIndicator = ({ total, current, className, idPrefix = 'nav' }) => {
    const [demoIndex, setDemoIndex] = useState(null);
    const hasSimulatedRef = useRef(false);

    // Initial "Simulated Swipe" Animation
    useEffect(() => {
        if (hasSimulatedRef.current) return;

        const timeout1 = setTimeout(() => {
            if (total > 1) {
                setDemoIndex(1); // Move to 2nd pos
                const timeout2 = setTimeout(() => {
                    setDemoIndex(null); // Move back
                    hasSimulatedRef.current = true;
                }, 400);
                return () => clearTimeout(timeout2);
            }
        }, 800);

        return () => clearTimeout(timeout1);
    }, [total]);

    // Determine active index
    const activeIndex = demoIndex !== null ? demoIndex : current;

    return (
        <div className={`flex items-center justify-center gap-[5px] ${className}`}>
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    layout // Animate width and position changes
                    initial={false}
                    animate={{
                        width: i === activeIndex ? 20 : 2, // Active 20px, Inactive 2px
                        opacity: i === activeIndex ? 1 : 0.8
                    }}
                    style={{ height: 2, borderRadius: 999 }} // Fixed height 2px, full rounded
                    className={`bg-[#05121C]`}
                    transition={{
                        duration: 0.3, // Smooth duration
                        ease: "easeInOut" // Linear-like ease, no bounce/stretch effect
                    }}
                />
            ))}
        </div>
    );
};

export default SwipeIndicator;
