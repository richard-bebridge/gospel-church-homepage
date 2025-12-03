import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDailyVerses } from '../../data/verses';

const Effect3 = () => {
    const words = useMemo(() => {
        const verses = getDailyVerses();
        const allText = verses.map(v => v.text).join(' ');
        return allText.split(' ').filter(w => w.length > 3); // Only longer words
    }, []);

    // Generate random snowflakes (words)
    const snowflakes = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            word: words[Math.floor(Math.random() * words.length)],
            x: Math.random() * 100, // Random X position %
            delay: Math.random() * 5, // Random start delay
            duration: 5 + Math.random() * 10, // Random fall duration
            size: 0.8 + Math.random() * 0.5 // Random scale
        }));
    }, [words]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#05121C]">
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute top-[-10%] text-white/20 font-serif whitespace-nowrap pointer-events-none select-none"
                    style={{
                        left: `${flake.x}%`,
                        fontSize: `${flake.size}rem`
                    }}
                    animate={{
                        top: '110%',
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: flake.duration,
                        repeat: Infinity,
                        delay: flake.delay,
                        ease: "linear"
                    }}
                >
                    {flake.word}
                </motion.div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white/10 font-sans font-bold text-6xl tracking-widest uppercase">
                    Word<br />of<br />God
                </div>
            </div>

            <div className="absolute top-4 right-4 text-xs font-mono text-gray-500">
                MODE: 3 (SNOW)
            </div>
        </div>
    );
};

export default Effect3;
