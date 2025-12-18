'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion } from 'lucide-react';

const FloatingVisitButton = ({ footerRef }) => {
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    // Footer Visibility Detection
    useEffect(() => {
        const footer = footerRef?.current;
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0.1 // 10% visibility triggers hide
            }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, [footerRef]);

    // Animation Variants
    const buttonVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.9,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <>
            <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />

            <AnimatePresence>
                {!isFooterVisible && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={buttonVariants}
                        className="fixed bottom-6 right-6 z-50 pointer-events-auto"
                    >
                        <button
                            data-tally-open="Y5RP46"
                            data-tally-hide-title="1"
                            data-tally-emoji-text="👋"
                            data-tally-emoji-animation="wave"
                            className="bg-[#05121C] text-[#F4F3EF] px-5 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 ring-2 ring-[#F4F3EF] font-medium font-korean"
                        >
                            <span>방문 문의</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingVisitButton;
